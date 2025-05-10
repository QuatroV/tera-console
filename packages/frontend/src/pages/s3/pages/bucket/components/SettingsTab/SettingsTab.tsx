import Button from "@/components/Button";
import Card from "@/components/Card";
import Switch from "@/components/Switch";
import trpc from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BucketAccessSettings() {
  const { id: bucketName } = useParams<{ id: string }>();

  const [publicRead, setPublicRead] = useState(false);
  const [versioning, setVersioning] = useState(false);
  const [accessLogging, setAccessLogging] = useState(false);
  const [encryption, setEncryption] = useState(false);
  const [expirationDays, setExpiration] = useState<number | "">("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await trpc.s3.getBucketSettings.query({
          bucket: bucketName || "",
        });
        setPublicRead(data.publicRead);
        setVersioning(data.versioning);
        setAccessLogging(data.accessLogging);
        setEncryption(data.encryption);
        setExpiration(data.expirationDays ?? "");
      } finally {
        setLoading(false);
      }
    })();
  }, [bucketName]);

  const onSave = async () => {
    setSaving(true);
    try {
      await trpc.s3.updateBucketSettings.mutate({
        bucket: bucketName || "",
        publicRead,
        versioning,
        accessLogging,
        encryption,
        expirationDays:
          expirationDays === "" ? undefined : Number(expirationDays),
      });
      alert("Настройки сохранены");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Загрузка настроек…</div>;

  return (
    <Card className="p-4 space-y-6 bg-white">
      <Setting label="Public Read" id="public-read">
        <Switch
          id="public-read"
          checked={publicRead}
          onCheckedChange={setPublicRead}
        />
      </Setting>

      <Setting label="Версионирование" id="versioning">
        <Switch
          id="versioning"
          checked={versioning}
          onCheckedChange={setVersioning}
        />
      </Setting>

      <Setting label="Access-logging" id="logging">
        <Switch
          id="logging"
          checked={accessLogging}
          onCheckedChange={setAccessLogging}
        />
      </Setting>

      <Setting label="SSE-S3 шифрование" id="enc">
        <Switch id="enc" checked={encryption} onCheckedChange={setEncryption} />
      </Setting>

      <Setting label="Auto-expire, дней" id="expire">
        <input
          id="expire"
          type="number"
          min={1}
          placeholder="—"
          className="w-24 rounded border px-2 py-1"
          value={expirationDays}
          onChange={(e) =>
            setExpiration(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </Setting>

      <Button
        size="large"
        variant="filled"
        className="rounded-xl p-4 "
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Сохраняю…" : "Сохранить"}
      </Button>
    </Card>
  );
}

function Setting({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 max-w-96">
      <label htmlFor={id} className="mr-auto text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
