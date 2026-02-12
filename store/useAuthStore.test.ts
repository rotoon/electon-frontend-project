import { act } from "@testing-library/react";
import { useAuthStore } from "./useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    act(() => {
      logout();
    });
  });

  it("should have initial state as unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should login correctly", () => {
    const mockUser = {
      id: 7,
      citizenId: "1509999999999",
      firstName: "John",
      lastName: "Doe",
      address: "x ถนน y",
      province: { id: 2, name: "เชียงใหม่" },
      district: { id: 20, name: "ดอยสะเก็ด" },
      constituency: { id: 10, number: 2, isClosed: false },
      roles: ["ROLE_VOTER"],
      createdAt: "2026-02-12T09:53:19.508Z",
    };

    act(() => {
      useAuthStore.getState().login(mockUser, "mock-token");
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("mock-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should logout correctly", () => {
    const mockUser = {
      id: 7,
      citizenId: "1509999999999",
      firstName: "John",
      lastName: "Doe",
      address: "x ถนน y",
      province: { id: 2, name: "เชียงใหม่" },
      district: { id: 20, name: "ดอยสะเก็ด" },
      constituency: { id: 10, number: 2, isClosed: false },
      roles: ["ROLE_VOTER"],
      createdAt: "2026-02-12T09:53:19.508Z",
    };

    act(() => {
      useAuthStore.getState().login(mockUser, "mock-token");
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
