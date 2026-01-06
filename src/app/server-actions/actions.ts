"use server";

/**
 * Server Actions Demo
 * -------------------
 * Server Actions are Next.js functions that run on the server.
 * They're perfect for form submissions, mutations, and any POST/PUT/PATCH operations.
 *
 * Key benefits:
 * - No API routes needed (simpler code)
 * - Type-safe (TypeScript)
 * - Automatic form handling
 * - Progressive enhancement (works without JavaScript)
 * - Built-in security (CSRF protection)
 *
 * This file demonstrates:
 * - POST: Creating new resources
 * - PUT: Full updates
 * - PATCH: Partial updates
 * - Form validation
 * - Error handling
 */

// In-memory store for demo purposes (in production, use a database)
export type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
};

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * POST Action: Create a new user
 * ------------------------------
 * This simulates a POST request to create a new resource.
 * In production, you'd save this to a database.
 */
export async function createUser(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Extract and validate form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const age = Number(formData.get("age"));

  // Validation
  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: "Name must be at least 2 characters long",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      error: "Please provide a valid email address",
    };
  }

  if (!age || age < 0 || age > 150) {
    return {
      success: false,
      error: "Age must be between 0 and 150",
    };
  }

  // Check for duplicate email
  if (users.some((u) => u.email === email)) {
    return {
      success: false,
      error: "A user with this email already exists",
    };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  return {
    success: true,
    data: newUser,
    message: "User created successfully!",
  };
}

/**
 * PUT Action: Update an entire user
 * ---------------------------------
 * PUT is used for full resource updates (replace the entire resource).
 * All fields must be provided.
 */
export async function updateUser(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const age = Number(formData.get("age"));

  // Validation
  if (!id) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: "Name must be at least 2 characters long",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      error: "Please provide a valid email address",
    };
  }

  if (!age || age < 0 || age > 150) {
    return {
      success: false,
      error: "Age must be between 0 and 150",
    };
  }

  // Find user
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return {
      success: false,
      error: "User not found",
    };
  }

  // Check for duplicate email (excluding current user)
  if (users.some((u) => u.id !== id && u.email === email)) {
    return {
      success: false,
      error: "A user with this email already exists",
    };
  }

  // Full update (PUT replaces entire resource)
  const updatedUser: User = {
    ...users[userIndex],
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return {
    success: true,
    data: updatedUser,
    message: "User updated successfully!",
  };
}

/**
 * PATCH Action: Partially update a user
 * -------------------------------------
 * PATCH is used for partial updates (only update provided fields).
 * Only the fields you send will be updated.
 */
export async function patchUser(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = formData.get("id") as string;
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const ageStr = formData.get("age") as string | null;

  // Validation
  if (!id) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  // Find user
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const currentUser = users[userIndex];
  const updates: Partial<User> = {
    updatedAt: new Date().toISOString(),
  };

  // Only update fields that are provided
  if (name !== null && name !== undefined && name.trim().length > 0) {
    if (name.trim().length < 2) {
      return {
        success: false,
        error: "Name must be at least 2 characters long",
      };
    }
    updates.name = name.trim();
  }

  if (email !== null && email !== undefined && email.trim().length > 0) {
    if (!email.includes("@")) {
      return {
        success: false,
        error: "Please provide a valid email address",
      };
    }
    // Check for duplicate email (excluding current user)
    if (
      users.some((u) => u.id !== id && u.email === email.trim().toLowerCase())
    ) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }
    updates.email = email.trim().toLowerCase();
  }

  if (ageStr !== null && ageStr !== undefined && ageStr.trim().length > 0) {
    const age = Number(ageStr);
    if (isNaN(age) || age < 0 || age > 150) {
      return {
        success: false,
        error: "Age must be between 0 and 150",
      };
    }
    updates.age = age;
  }

  // Partial update (PATCH only updates provided fields)
  const updatedUser: User = {
    ...currentUser,
    ...updates,
  };

  users[userIndex] = updatedUser;

  return {
    success: true,
    data: updatedUser,
    message: "User partially updated successfully!",
  };
}

/**
 * GET Action: Fetch all users
 * ---------------------------
 * Server Actions can also be used for data fetching (though Server Components
 * are often preferred for read operations).
 */
export async function getUsers() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    success: true,
    data: users,
  };
}

/**
 * DELETE Action: Delete a user
 * ----------------------------
 * Demonstrates DELETE operation via server action.
 */
export async function deleteUser(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = formData.get("id") as string;

  if (!id) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return {
      success: false,
      error: "User not found",
    };
  }

  users.splice(userIndex, 1);

  return {
    success: true,
    message: "User deleted successfully!",
  };
}
