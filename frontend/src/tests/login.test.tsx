import Login from "../pages/login";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
jest.mock("next/router", () => require("next-router-mock"));

describe("Login Page", () => {
  it("should render correctly", () => {
    render(<Login />);
    // check if all components are rendered
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Or Register")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
});
