// Chakra theme config

import { extendTheme, type StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("white", "black")(props)
            }
        })
    }
});

export default theme;
