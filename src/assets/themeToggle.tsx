import { Icon, Switch } from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"
import "../styles/Components/Sidebar.css"

const ThemeToggle = () => {
  return (
    <div>
        <Switch.Root  className="theme" colorPalette="blue" size="lg">
            <Switch.HiddenInput />
            <Switch.Label color={"whiteAlpha.700"} fontSize={"17px"} className="Light">Light</Switch.Label>
            <Switch.Control >
              <Switch.Thumb background={"blackAlpha.500"}/>
              <Switch.Indicator  fallback={<Icon as={FaMoon} color="gray.800" />}>
                <Icon as={FaSun} color="yellow.400" />
              </Switch.Indicator>
            </Switch.Control>
            <Switch.Label color={"whiteAlpha.700"} fontSize={"17px"} className="Dark">Dark</Switch.Label>
        </Switch.Root>
    </div>
  )
}

export default ThemeToggle