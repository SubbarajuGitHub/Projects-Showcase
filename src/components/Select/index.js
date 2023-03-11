import {Component} from 'react'

import './index.css'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Select extends Component {
  state = {
    projectsList: [],
    activeTabId: categoriesList[0].id,
    activeStatus: apiConstants.inProgress,
  }

  componentDidMount() {
    this.fetchingProjects()
  }

  fetchingProjects = async () => {
    const {projectsList, activeTabId, activeStatus} = this.state
    console.log(activeTabId)
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const data = await fetch(url)
    if (data.ok === true) {
      const dataJson = await data.json()
      const dataDestructing = dataJson.projects
      const dataCamelCase = dataDestructing.map(Each => ({
        name: Each.name,
        imageUrl: Each.image_url,
        id: Each.id,
      }))
      this.setState({
        projectsList: dataCamelCase,
        activeStatus: apiConstants.success,
      })
    } else {
      this.setState({activeStatus: apiConstants.failure})
    }
  }

  StartPage = () => {
    const {activeStatus} = this.state
    this.setState(
      {activeStatus: apiConstants.inProgress},
      this.fetchingProjects,
    )
  }

  changeProjectsList = event => {
    const convert = event.target.value.toUpperCase()
    this.setState({activeTabId: convert}, this.fetchingProjects)
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // render success page

  renderSuccessPage = () => {
    const {projectsList, activeStatus, activeTabId} = this.state
    return (
      <div>
        <div className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <select
          className="select"
          onChange={this.changeProjectsList}
          value={activeTabId}
        >
          {categoriesList.map(Each => (
            <option key={Each.id} value={Each.id}>
              {Each.displayText}
            </option>
          ))}
        </select>
        <ul className="ul-list">
          {projectsList.map(EachProject => (
            <ProjectItem EachProject={EachProject} key={EachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  // render failure page
  renderFailurePage = () => {
    const {activeStatus} = this.state
    return (
      <>
        <div className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <select className="select" onChange={this.changeProjectsList}>
          {categoriesList.map(Each => (
            <option key={Each.id} value={Each.id}>
              {Each.displayText}
            </option>
          ))}
        </select>
        <div className="failure-div">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
            alt="failure view"
            className="failure-image"
          />
          <h1 className="failure-heading">Oops! Something Went Wrong</h1>
          <p className="failure-paragraph">
            We cannot seem to find the page you are looking for
          </p>
          <button
            type="button"
            className="retry-button"
            onClick={this.StartPage}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  renderLastPage = () => {
    const {activeStatus} = this.state
    switch (activeStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccessPage()
      case apiConstants.failure:
        return this.renderFailurePage()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderLastPage()}</div>
  }
}
export default Select
