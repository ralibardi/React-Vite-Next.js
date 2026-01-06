"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
  patchUser,
  type User,
  updateUser,
} from "./actions";

/**
 * Server Actions Demo Component
 * -----------------------------
 * This Client Component demonstrates:
 * - Form submissions with Server Actions
 * - POST, PUT, and PATCH operations
 * - Loading states with useTransition
 * - Error handling
 * - Optimistic updates
 */

export function ServerActionsDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load users on mount
  const loadUsers = useCallback(async () => {
    const result = await getUsers();
    if (result.success && result.data) {
      setUsers(result.data);
    }
  }, []);

  // Initialize users on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="flex flex-col gap-8 mt-8">
      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* POST: Create User Form */}
      <section className="flex flex-col gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
            POST - Create User
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Create a new user resource. All fields are required.
          </p>
        </div>
        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await createUser(formData);
              if (result.success) {
                showMessage("success", result.message || "User created!");
                await loadUsers();
                // Reset form
                const form = document.getElementById(
                  "create-form",
                ) as HTMLFormElement;
                form?.reset();
              } else {
                showMessage("error", result.error || "Failed to create user");
              }
            });
          }}
          id="create-form"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="create-name"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Name
            </label>
            <input
              type="text"
              id="create-name"
              name="name"
              required
              minLength={2}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="John Doe"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="create-email"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Email
            </label>
            <input
              type="email"
              id="create-email"
              name="email"
              required
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="john@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="create-age"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Age
            </label>
            <input
              type="number"
              id="create-age"
              name="age"
              required
              min={0}
              max={150}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="30"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Creating..." : "Create User (POST)"}
          </button>
        </form>
      </section>

      {/* PUT: Update User Form */}
      <section className="flex flex-col gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
            PUT - Full Update
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Update an entire user resource. All fields must be provided
            (replaces the entire resource).
          </p>
        </div>
        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await updateUser(formData);
              if (result.success) {
                showMessage("success", result.message || "User updated!");
                await loadUsers();
                setSelectedUser(null);
                const form = document.getElementById(
                  "update-form",
                ) as HTMLFormElement;
                form?.reset();
              } else {
                showMessage("error", result.error || "Failed to update user");
              }
            });
          }}
          id="update-form"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="update-id"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              User ID
            </label>
            <input
              type="text"
              id="update-id"
              name="id"
              required
              value={selectedUser?.id || ""}
              onChange={(e) => {
                const user = users.find((u) => u.id === e.target.value);
                setSelectedUser(user || null);
                if (user) {
                  // Pre-fill form with user data
                  const form = document.getElementById(
                    "update-form",
                  ) as HTMLFormElement;
                  if (form) {
                    (
                      form.elements.namedItem("name") as HTMLInputElement
                    ).value = user.name;
                    (
                      form.elements.namedItem("email") as HTMLInputElement
                    ).value = user.email;
                    (form.elements.namedItem("age") as HTMLInputElement).value =
                      user.age.toString();
                  }
                }
              }}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Select user ID from list below"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="update-name"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Name
            </label>
            <input
              type="text"
              id="update-name"
              name="name"
              required
              minLength={2}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="update-email"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Email
            </label>
            <input
              type="email"
              id="update-email"
              name="email"
              required
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="update-age"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Age
            </label>
            <input
              type="number"
              id="update-age"
              name="age"
              required
              min={0}
              max={150}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !selectedUser}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Updating..." : "Update User (PUT)"}
          </button>
        </form>
      </section>

      {/* PATCH: Partial Update Form */}
      <section className="flex flex-col gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
            PATCH - Partial Update
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Partially update a user. Only provide the fields you want to update
            (others remain unchanged).
          </p>
        </div>
        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await patchUser(formData);
              if (result.success) {
                showMessage(
                  "success",
                  result.message || "User partially updated!",
                );
                await loadUsers();
                setSelectedUser(null);
                const form = document.getElementById(
                  "patch-form",
                ) as HTMLFormElement;
                form?.reset();
              } else {
                showMessage("error", result.error || "Failed to update user");
              }
            });
          }}
          id="patch-form"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="patch-id"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              User ID
            </label>
            <input
              type="text"
              id="patch-id"
              name="id"
              required
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter user ID"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="patch-name"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Name (optional)
            </label>
            <input
              type="text"
              id="patch-name"
              name="name"
              minLength={2}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Leave empty to keep unchanged"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="patch-email"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Email (optional)
            </label>
            <input
              type="email"
              id="patch-email"
              name="email"
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Leave empty to keep unchanged"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="patch-age"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Age (optional)
            </label>
            <input
              type="number"
              id="patch-age"
              name="age"
              min={0}
              max={150}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Leave empty to keep unchanged"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Updating..." : "Partial Update (PATCH)"}
          </button>
        </form>
      </section>

      {/* Users List */}
      <section className="flex flex-col gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
              Users List
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Current users in the system. Click refresh to reload.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
        {users.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No users yet. Create one using the POST form above!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-md"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-black dark:text-zinc-50">
                    {user.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email} • Age: {user.age}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    ID: {user.id} • Created:{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>
                <form
                  action={async (formData) => {
                    startTransition(async () => {
                      const result = await deleteUser(formData);
                      if (result.success) {
                        showMessage(
                          "success",
                          result.message || "User deleted!",
                        );
                        await loadUsers();
                      } else {
                        showMessage(
                          "error",
                          result.error || "Failed to delete user",
                        );
                      }
                    });
                  }}
                >
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
