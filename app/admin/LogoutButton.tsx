"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin-login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm rounded-md border border-stone-300 hover:bg-stone-100 transition"
    >
      Logout
    </button>
  );
}
