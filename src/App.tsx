import NotFound from "./Components/NotFound";
import React from "react";
import { Routes, Link, Route } from "react-router-dom";
import Home from "./pages/Home";
import SuperHeros from "./pages/SuperHeros";
import styled from "styled-components";

const StyledUl = styled.ul`
  display: flex;
  background-color: blanchedalmond;
  margin-block-start: 0;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StyledLi = styled.li`
  list-style-type: none;
  margin-right: 16px;
`;

function App() {
  return (
    <>
      <nav>
        <StyledUl>
          <StyledLi>
            <Link to="/">Home</Link>
          </StyledLi>
          <StyledLi>
            <Link to="/super-heros">SuperHeros</Link>
          </StyledLi>
        </StyledUl>
      </nav>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/super-heros" element={<SuperHeros />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
