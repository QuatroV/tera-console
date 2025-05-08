import { useEffect, useState, useRef } from "react";
import { trpc } from "@/utils/api";

import Card from "@/components/Card";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { FaCircleUser } from "react-icons/fa6";
import { PAGES } from "@/router/constants";
import PasswordChangeModal from "./components/PasswordChangeModal";
import cn from "@/utils/cn";

/* ――― helpers ――― */
const randomKey = (uid: string, ext: string) =>
  `${uid}_${Date.now().toString(36)}.${ext}`;

export default function UserPage() {
  /* ---------- state ---------- */
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", photo: "", email: "" });

  /** локально выбранная картинка (НЕ загружаем сразу) */
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------- fetch me ---------- */
  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await trpc.user.getMe.query();
      const u = res.data.user;
      setUser(u);
      setForm({
        name: u?.name ?? "",
        photo: u?.photo ?? "",
        email: u?.email ?? "",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMe();
  }, []);

  /* ---------- pick avatar ---------- */
  const chooseFile = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLocalFile(f);
    /* preview для UX */
    setLocalPreview(URL.createObjectURL(f));
  };

  /* ---------- save ---------- */
  const save = async () => {
    if (!form.name.trim()) return alert("Имя не может быть пустым");
    setSaving(true);

    /* итоговый URL для User.photo */
    let finalPhoto = form.photo.trim() || undefined;

    try {
      /* 1) если выбрали новый файл — сначала загрузим его в S3 avatars */
      if (localFile && user?.id) {
        const ext = localFile.name.split(".").pop() || "png";
        const key = randomKey(user.id, ext);

        /* получаем presigned PUT — серверная ручка уже есть */
        const { url } = await trpc.s3.putObjectPresigned.mutate({
          bucket: "avatars",
          key,
        });

        /* отправляем файл прямо в MinIO / S3 */
        await fetch(url, { method: "PUT", body: localFile });

        const publicBase =
          import.meta.env.VITE_S3_PUBLIC ?? "http://localhost:9000"; // ← настройте в .env
        finalPhoto = `${publicBase}/avatars/${key}`;
      }

      await trpc.user.updateMe.mutate({
        name: form.name.trim(),
        photo: finalPhoto,
      });

      await fetchMe();
      setLocalFile(null);
      setLocalPreview(null);
      alert("Профиль обновлён");
    } catch (e) {
      console.error(e);
      alert("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- delete me ---------- */
  const remove = async () => {
    if (!confirm("Удалить аккаунт безвозвратно?")) return;
    try {
      await trpc.user.deleteMe.mutate();
      window.location.href = "/"; // logout
    } catch {
      alert("Ошибка удаления");
    }
  };

  /* ---------- UI ---------- */
  if (loading)
    return (
      <div className="flex justify-center pt-12">
        <Spinner className="size-12 text-indigo-500" />
      </div>
    );

  return (
    <div>
      <PageTitle
        title="Настройки профиля"
        items={[
          { name: "teraCloud", link: PAGES.CONSOLE.path },
          { name: "Профиль", link: "" },
        ]}
        Icon={FaCircleUser}
      />

      <Card className="p-6 flex flex-col gap-6">
        {/* ---------- имя ---------- */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Имя</span>
          <Input
            className="border p-4 w-96"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          />
        </label>

        {/* ---------- email ---------- */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Адрес электронной почты</span>
          <Input
            className="border p-4 w-96"
            value={form.email}
            onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1 ">
          <span className="font-medium">Аватар</span>

          <div className={cn(localPreview && "bg-gray-100 rounded-2xl w-min")}>
            <div className="relative w-min">
              <Input
                className="border p-4 w-96 pr-36 overflow-hidden text-ellipsis"
                value={form.photo}
                onChange={(e) =>
                  setForm((v) => ({ ...v, photo: e.target.value }))
                }
              />

              {/* кнопка выбора локального файла + превью, если выбрали */}
              <div className="flex items-center gap-4 absolute top-1/2 right-2 transform -translate-y-1/2">
                <Button
                  variant="filled"
                  size="small"
                  className="rounded-xl px-4 py-2"
                  onClick={chooseFile}
                >
                  Выбрать файл…
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            </div>

            {localPreview && (
              <div className="flex flex-col gap-2 p-2">
                <p className=" text-gray-500 italic">Превью аватара</p>
                <img
                  src={localPreview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-full border mb-1"
                />
              </div>
            )}
          </div>
        </label>

        {/* ---------- actions ---------- */}
        <div className="flex gap-4 mt-2">
          <Button
            className="p-4 rounded-2xl"
            variant="filled"
            disabled={saving}
            onClick={save}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button
            className="p-4 rounded-2xl"
            variant="outlined"
            onClick={() => setPwdOpen(true)}
          >
            Сменить пароль
          </Button>
          <Button
            variant="outlined"
            className="p-4 rounded-2xl ml-auto text-red-600 border-red-500"
            onClick={remove}
          >
            Удалить аккаунт
          </Button>
        </div>
      </Card>

      <PasswordChangeModal
        modalOpen={pwdOpen}
        setModalOpen={setPwdOpen}
        onClose={fetchMe}
      />
    </div>
  );
}
