'use client';
import { Center, Heading } from "@chakra-ui/react";
import Feed from "../../components/Feed/Feed";

export default function Home() {
  return (
    <Center flexDirection="column">
      {/* <Heading mb={8}>Hello World</Heading> */}
      <Feed />
    </Center>
  );
}