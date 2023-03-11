import {Component} from 'react'

import './index.css'

class ProjectItem extends Component {
  render() {
    const {EachProject} = this.props
    const {imageUrl, name} = EachProject
    return (
      <li className="list-items">
        <img src={imageUrl} className="image" alt={name} />
        <p className="name">{name}</p>
      </li>
    )
  }
}
export default ProjectItem
