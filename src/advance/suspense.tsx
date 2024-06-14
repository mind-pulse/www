import type React from "react";
import { Suspense } from "react";
import Loading from "~/components/loading";

const suspense = (component: React.ReactNode) => (
  <Suspense fallback={<Loading />}>{component}</Suspense>
);

export default suspense;
