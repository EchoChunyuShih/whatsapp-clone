import styled from "styled-components";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Navbar = () => {
  return (
    <Wrapper>
      <NavContainer>
        <AppIcon />
        <Header>WhatsApp Web</Header>
      </NavContainer>
    </Wrapper>
  );
};

export default Navbar;
const Wrapper = styled.div`
  height: 15vh;
  padding: 1rem 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
`;
const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  color: whitesmoke;
`;

const AppIcon = styled(WhatsAppIcon)`
  margin: 0 1rem;
  &&& {
    font-size: 2rem;
  }
`;

const Header = styled.h1`
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 450;
`;
