import * as React from 'react';
import clsx from 'clsx';

export function Container({ children, className, wide = false }: { children: React.ReactNode; className?: string; wide?: boolean }) {
  return <div className={clsx('mx-auto w-full px-4 lg:px-6', wide ? 'max-w-[1600px]' : 'max-w-[1320px]', className)}>{children}</div>;
}

export function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={clsx('py-10 sm:py-12', className)}>{children}</section>;
}

/** Standard page frame for every non-portal route. */
export function Page({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main id="main">
      <Container wide={wide} className="py-8 sm:py-10">{children}</Container>
    </main>
  );
}
