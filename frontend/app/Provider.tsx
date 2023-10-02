import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

type Provider = {
  children: ReactNode;
};

export function Providers({ children }: Provider) {
  return <Provider store={store}>{children}</Provider>;
}
