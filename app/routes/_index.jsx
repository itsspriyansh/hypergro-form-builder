import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("/create");
}

export default function Index() {
  return null;
} 