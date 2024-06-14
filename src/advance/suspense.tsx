import React, { Suspense } from "react";
import Loading from "~/components/loading";

const suspense = (component: React.ReactNode) => (
  <Suspense fallback={<Loading />}>{component}</Suspense>
);

export default suspense;
