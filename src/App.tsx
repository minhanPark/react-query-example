import NotFound from "./Components/NotFound";
import React from "react";
import { Routes, Link, Route } from "react-router-dom";
import Home from "./pages/Home";
import SuperHeros from "./pages/SuperHeros";
import styled from "styled-components";
import SuperHeroDetail from "./Components/SuperHeroDetail";
import Parallel from "./pages/Parallel";
import Dependent from "./pages/Dependent";
import Pagenated from "./pages/Pagenated";
import Infinite from "./pages/Infinite";

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
          <StyledLi>
            <Link to="/parallel">Parallel</Link>
          </StyledLi>
          <StyledLi>
            <Link to="/dependent">Dependent</Link>
          </StyledLi>
          <StyledLi>
            <Link to="/pagenated">Pagenated</Link>
          </StyledLi>
          <StyledLi>
            <Link to="/infinite">Infinite</Link>
          </StyledLi>
        </StyledUl>
      </nav>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/super-heros">
            <Route index element={<SuperHeros />} />
            <Route path=":heroId" element={<SuperHeroDetail />} />
          </Route>
          <Route path="/parallel" element={<Parallel />} />
          <Route path="/dependent" element={<Dependent />} />
          <Route path="/pagenated" element={<Pagenated />} />
          <Route path="/infinite" element={<Infinite />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
