import React from "react";
import styled from "styled-components";
import Box from "./Box";
import Text from "./Text";

const Container = styled.div`
  max-width: 400px;
  padding-top: 50px;
  margin: 0 auto;
`;

const DocumentWrapper = ({ title, children }) => {
  return (
    <Container>
      <Box textAlign="center" padBottom="normal">
        <Text preset="document-title">{title}</Text>
      </Box>
      {children}
    </Container>
  );
};

export default DocumentWrapper;
