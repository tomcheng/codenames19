import React from "react";
import styled from "styled-components";
import Box from "./Box";
import Text from "./Text";

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const Paper = styled.div`
  background-color: #fff;
  width: 460px;
  margin: 40px auto 0;
  padding-bottom: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const DocumentWrapper = ({ title, children }) => {
  return (
    <Paper>
      <Box padY="loose" padX="normal">
        <Container>
          <Box textAlign="center" padBottom="tight">
            <Text preset="document-title">{title}</Text>
          </Box>
          {children}
        </Container>
      </Box>
    </Paper>
  );
};

export default DocumentWrapper;
