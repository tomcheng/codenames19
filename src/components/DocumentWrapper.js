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
  max-width: 460px;
  margin: 32px auto 24px;
  padding-bottom: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const DocumentWrapper = ({ title, children }) => {
  return (
    <Box padX="normal">
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
    </Box>
  );
};

export default DocumentWrapper;
