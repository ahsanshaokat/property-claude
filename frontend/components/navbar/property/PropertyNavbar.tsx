import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "@/components/navbar/property/property-navbar.module.css";
import HamBurgerIcon from "../HamBurgerIcon";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import SubmitButton from "@/components/common/form/SubmitButton";
import { useState } from "react";
import Button from "react-bootstrap/Button";  // Ensure Button is imported

const PropertyNavbar = () => {
  const router = useRouter();
  const [buttonRef, setButtonRef] = useState<number | string>("");
  const { data: session } = useSession();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className={`${styles.navBgColor} py-4`}
    >
      <Container>
        <Navbar.Brand
          href="/"
          role="general-navbar-brand-role"
          className={`${styles.ft18} ${styles.ftBold}`}
        >
          {/* Replace text with the logo image */}
          <img 
            src="/images/vertical_full_white.png"  // Correct path for the image
            alt="ekzameen Logo"
            style={{ height: '40px' }}  // Adjust height to fit the navbar
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          role="navbar-toggle-role"
          className="border-none"
        >
          <HamBurgerIcon />
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/property-type/properties"
              className={`text-white ${styles.ft14}`}
            >
              Properties
            </Nav.Link>
            <Nav.Link href="/agents" className={`text-white ${styles.ft14}`}>
              Agents
            </Nav.Link>
            <Nav.Link href="#" className={`text-white ${styles.ft14}`}>
              Accounts
            </Nav.Link>
          </Nav>
          <Nav>
            {!session && (
              <>
                {/* Add Property Button */}
                <Button
                  variant="warning"
                  role="general-nav-add-property-btn"
                  className={`ml-5 text-dark fw-bold ft-14 rounded-0`}
                  onClick={() => router.push("/admin/properties/create")}
                >
                  Add Property
                </Button>

                {/* Sign In/Sign Up Links */}
                <Nav.Link
                  href="/auth/signin"
                  className={`text-white ${styles.ft14}`}
                >
                  Sign In
                </Nav.Link>
                <Nav.Link
                  href="/auth/signup"
                  className={`text-white ${styles.ft14} mr-2`}
                >
                  Sign Up
                </Nav.Link>
              </>
            )}

            {session && (
              <>
                <SubmitButton
                  title="Dashboard"
                  variant="warning"
                  isLoading={false}
                  btnId="dashboard"
                  btnRef={buttonRef}
                  onClick={async () => {
                    setButtonRef("dashboard");
                    await router.push("/admin/home");
                  }}
                  loadingTitle="Redirecting"
                  buttonCls={`text-dark ${styles.ftBold} ${styles.ft14} rounded-0`}
                  style={{ marginRight: "10px" }}
                />
                <SubmitButton
                  title="Log Out"
                  variant="outline-light"
                  isLoading={false}
                  btnId="log_out"
                  btnRef={buttonRef}
                  onClick={async () => {
                    setButtonRef("log_out");
                    await signOut();
                  }}
                  loadingTitle="Logging out"
                  buttonCls="rounded-0"
                  titleCls="ft-14"
                />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PropertyNavbar;
