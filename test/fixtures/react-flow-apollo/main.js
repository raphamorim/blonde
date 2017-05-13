import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

import { Image } from './src/index'

const apolloClient = new ApolloClient({
   networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
})

const App = ({ apolloClient, productId }) => (
  <ApolloProvider client={apolloClient}>
    <div>
      <Image src={'http//image.jpg'} />
      <h2>My Image</h2>
    </div>
  </ApolloProvider>
)

App.defaultProps = { apolloClient }

export default App
