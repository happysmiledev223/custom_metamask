import React from 'react';
import { RemoteAccount } from '.';

export default {
  title: 'Components/Multichain/RemoteAccount',
  component: RemoteAccount,
};

export const DefaultStory = (args) => <RemoteAccount {...args} />;
DefaultStory.storyName = 'Default';
