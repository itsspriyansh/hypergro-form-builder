import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("/forms");
}

export default function Index() {
  return null;
} 