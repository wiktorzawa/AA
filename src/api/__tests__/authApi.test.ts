import { describe, it, expect, vi, beforeEach } from "vitest";
import { zaloguj, wyloguj } from "../authApi";
import { useAuthStore } from "../../stores/authStore";
import strapiAdapter from "../strapiAdapter";

// Mock strapiAdapter
vi.mock("../strapiAdapter", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock useAuthStore
vi.mock("../../stores/authStore", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      login: vi.fn(),
      logout: vi.fn(),
    })),
  },
}));

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  describe("zaloguj", () => {
    it("should successfully login admin user", async () => {
      // Arrange
      const mockLoginResponse = {
        jwt: "mock-jwt-token",
        user: {
          id: 1,
          email: "admin@msbox.com",
          username: "admin",
          confirmed: true,
          blocked: false,
        },
      };

      const mockUserProfile = {
        id: 1,
        email: "admin@msbox.com",
        username: "admin",
        staff_profile: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          position: "admin",
        },
        supplier_profile: null,
      };

      (strapiAdapter.post as any).mockResolvedValue(mockLoginResponse);
      (strapiAdapter.get as any).mockResolvedValue(mockUserProfile);

      // Act
      const result = await zaloguj({
        email: "admin@msbox.com",
        password: "admin123",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.appRole).toBe("admin");
      expect(result.jwt).toBe("mock-jwt-token");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "token",
        "mock-jwt-token",
      );
    });

    it("should successfully login staff user", async () => {
      // Arrange
      const mockLoginResponse = {
        jwt: "mock-jwt-token",
        user: { id: 2, email: "staff@msbox.com" },
      };

      const mockUserProfile = {
        id: 2,
        email: "staff@msbox.com",
        staff_profile: {
          id: 2,
          firstName: "Staff",
          lastName: "User",
          position: "staff",
        },
        supplier_profile: null,
      };

      (strapiAdapter.post as any).mockResolvedValue(mockLoginResponse);
      (strapiAdapter.get as any).mockResolvedValue(mockUserProfile);

      // Act
      const result = await zaloguj({
        email: "staff@msbox.com",
        password: "staff123",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.appRole).toBe("staff");
    });

    it("should successfully login supplier user", async () => {
      // Arrange
      const mockLoginResponse = {
        jwt: "mock-jwt-token",
        user: { id: 3, email: "supplier@msbox.com" },
      };

      const mockUserProfile = {
        id: 3,
        email: "supplier@msbox.com",
        staff_profile: null,
        supplier_profile: {
          id: 3,
          companyName: "Test Company",
          nip: "1234567890",
        },
      };

      (strapiAdapter.post as any).mockResolvedValue(mockLoginResponse);
      (strapiAdapter.get as any).mockResolvedValue(mockUserProfile);

      // Act
      const result = await zaloguj({
        email: "supplier@msbox.com",
        password: "supplier123",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.appRole).toBe("supplier");
    });

    it("should handle login failure", async () => {
      // Arrange
      (strapiAdapter.post as any).mockRejectedValue({
        response: {
          data: {
            error: {
              message: "Invalid credentials",
            },
          },
        },
      });

      // Act
      const result = await zaloguj({
        email: "wrong@email.com",
        password: "wrongpassword",
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Invalid credentials");
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    });

    it("should handle user without profile", async () => {
      // Arrange
      const mockLoginResponse = {
        jwt: "mock-jwt-token",
        user: { id: 4, email: "noprofile@msbox.com" },
      };

      const mockUserProfile = {
        id: 4,
        email: "noprofile@msbox.com",
        staff_profile: null,
        supplier_profile: null,
      };

      (strapiAdapter.post as any).mockResolvedValue(mockLoginResponse);
      (strapiAdapter.get as any).mockResolvedValue(mockUserProfile);

      // Act
      const result = await zaloguj({
        email: "noprofile@msbox.com",
        password: "password123",
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain(
        "Nie można określić roli użytkownika",
      );
    });
  });

  describe("wyloguj", () => {
    it("should successfully logout user", async () => {
      // Arrange
      const mockLogout = vi.fn();
      vi.mocked(useAuthStore.getState).mockReturnValue({
        logout: mockLogout,
      } as any);

      // Act
      const result = await wyloguj();

      // Assert
      expect(result.success).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
