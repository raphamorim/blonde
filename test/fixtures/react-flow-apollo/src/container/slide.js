import { PropTypes } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, mapProps } from 'recompose'

import Image from '../presenter/image'

const query = gql`
  query() {
    image(id: $id) { src }
  }
`

const mapDataToProps = ({ data = {}, ...props }) => {
  if (!data.image) return {}

  return ({
    src: data.image.src,
    ...props,
  })
}

const Enhance = compose(
  graphql(query, {
    options: ({ id }) => ({ variables: { id } })
  }),
  mapProps(mapDataToProps)
)

const Slide = Enhance(Image)

Slide.propTypes = {
  src: PropTypes.string,
}

export default Slide
export { Slide }
