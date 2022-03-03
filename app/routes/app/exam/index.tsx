import React from 'react';
import Card from '~/components/Card';
import LinkButton from '~/components/LinkButton';

function Index() {
  return (
    <div
      className="flex flex-1 flex-row gap-4 justify-center"
    >
      <Card>
        <LinkButton to="start">Rozpocznij egzamin</LinkButton>
      </Card>
    </div>
  );
}

export default Index;
