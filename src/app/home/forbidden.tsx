export default function ForbiddenPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-6">
      <h1 className="text-4xl font-bold">403 Forbidden</h1>
      <p className="text-lg mt-3 opacity-70">
        Kamu tidak punya akses ke halaman ini.
      </p>
    </div>
  );
}
