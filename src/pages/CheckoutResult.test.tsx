import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CheckoutResult from "./CheckoutResult";

const clearCartMock = vi.fn();

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({ clearCart: clearCartMock }),
}));

vi.mock("@/components/layout/Header", () => ({ Header: () => <div /> }));
vi.mock("@/components/layout/Footer", () => ({ Footer: () => <div /> }));

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/checkout/result" element={<CheckoutResult />} />
        <Route
          path="/profile"
          element={
            <div data-testid="profile-page">
              <span data-testid="profile-search">{window.location.search}</span>
              {/* Simulate the highlighted order row */}
              <ProfileLanding />
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function ProfileLanding() {
  const search = new URLSearchParams(window.location.search);
  const tab = search.get("tab");
  const newOrder = search.get("new");
  return (
    <div>
      <span data-testid="tab">{tab}</span>
      {newOrder ? (
        <div data-testid={`order-${newOrder}`} className="bg-[#FFF7F2] outline outline-2 outline-[#C75B2A]">
          Order #{newOrder}
        </div>
      ) : null}
    </div>
  );
}

describe("CheckoutResult — successful payment", () => {
  beforeEach(() => {
    clearCartMock.mockReset();
    // jsdom shares window.location across the suite; reset via MemoryRouter handles it.
  });

  it("redirects to My Account → Orders with the new order highlighted", async () => {
    renderAt("/checkout/result?status=success&order_id=7198");

    // Confirmation page must NOT render
    expect(screen.queryByText(/Confirming payment/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Payment not completed/i)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });

    // Lands on the Orders tab
    expect(screen.getByTestId("tab").textContent).toBe("orders");

    // New order is highlighted
    const highlighted = screen.getByTestId("order-7198");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted.className).toContain("outline-[#C75B2A]");

    // Cart was cleared
    expect(clearCartMock).toHaveBeenCalledTimes(1);
  });

  it("accepts status=ok as success", async () => {
    renderAt("/checkout/result?status=ok&order_id=42");
    await waitFor(() => {
      expect(screen.getByTestId("order-42")).toBeInTheDocument();
    });
  });

  it("does NOT redirect on failure — shows retry screen", async () => {
    renderAt("/checkout/result?status=failed&order_id=7198");
    await waitFor(() => {
      expect(screen.getByText(/Payment not completed/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("profile-page")).not.toBeInTheDocument();
    expect(clearCartMock).not.toHaveBeenCalled();
  });
});