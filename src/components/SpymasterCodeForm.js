import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Text from "./Text";
import Input from "./Input";
import Button from "./Button";

const SpymasterCodeForm = ({ onSubmitCode }) => {
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");

  return (
    <Box
      as="form"
      flex
      onSubmit={(evt) => {
        evt.preventDefault();
        if (!code || !number) return;
        onSubmitCode({ code, number: parseInt(number) });
      }}
    >
      <Box borderRight pad="tight" padTop="x-tight" flexible>
        <Text as="label" htmlFor="code" preset="label">
          Code Word
        </Text>
        <div>
          <Input
            autoFocus
            id="code"
            name="code"
            value={code}
            onChange={(evt) => {
              setCode(evt.target.value);
            }}
          />
        </div>
      </Box>
      <Box pad="tight" padTop="x-tight" borderRight width={120}>
        <Text as="label" htmlFor="number" preset="label">
          Number
        </Text>
        <div>
          <Input
            id="number"
            name="number"
            type="number"
            value={number}
            onChange={(evt) => {
              setNumber(evt.target.value);
            }}
          />
        </div>
      </Box>
      <Box pad="tight" flex alignItems="center">
        <Button type="submit">Submit</Button>
      </Box>
    </Box>
  );
};

SpymasterCodeForm.propTypes = {
  onSubmitCode: PropTypes.func.isRequired,
};

export default SpymasterCodeForm;
