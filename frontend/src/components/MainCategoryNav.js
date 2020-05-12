import React, { Component } from 'react';
import '../stylesheets/MainCategoryNav.css';

class MainCategoryNav extends Component {
  constructor(){
    super();
    this.state = {
      visibleSub: false,
      activeId: null,
      eduList: [],
      sysList: [],
      subActiveId: null,
      prevActiveIndex: 0,
      prevActiveIndexSub: 0,
    }
  }

  setEducationList(value) {
    this.setState( {nextLevel: value.education_list})
  }

  flipActiveSystem(index, item_id) {
    const navs_items = document.getElementsByClassName('sub')
    if(navs_items){
      navs_items[this.prevActiveIndexSub].classList.remove('active')
      navs_items[index].classList.add('active')
      this.activeId = item_id;
      this.prevActiveIndexSub = index;}
  }

  flipActive(index, item_id) {
    const navs_items = document.getElementsByClassName('system')
    if(navs_items){
    navs_items[this.prevActiveIndex].classList.remove('active')
    navs_items[index].classList.add('active')
    this.activeId = item_id;
    this.prevActiveIndex = index;}
    console.log(this.eduList)
    this.setState( {visibleSub: this.eduList?true:false})
    this.sysList.forEach(element => {
      if (element.id === item_id){
        this.eduList = element.education_list
      }
    });
  }

  render() {
    const { list_values, current_system } = this.props;
    this.activeId = current_system?current_system.id:null;
    this.prevActiveIndex = 0;
    this.prevActiveIndexSub = 0;
    this.subActiveId = current_system?current_system.education_list[0].id:null;
    this.eduList = current_system?current_system.education_list:null;
    this.sysList = list_values
    
    return (
      <div>
        {this.activeId && <div>
        <div className='Main-holder_nav main-system'>
          <ul className="Main-holder_nav__list">
            {
              list_values.map(
                (list_item, ind) => (
                  <li key={ind} className="Main-holder_nav__item"><a href="#" onClick={() => this.flipActive(ind, list_item.id)} className={"Main-holder_nav__link system Main-holder__nav__link--button" + (Number(this.activeId)===list_item.id ? ' active' : '')}>{list_item.name}</a></li>
                )
              )
            }
          </ul>
        </div>
        <div className='Main-holder_nav main-sub' style={{"visibility": this.state.visibleSub ? 'visible' : 'hidden'}}>
          <ul className="Main-holder_nav__list">
            {
              current_system && current_system.education_list.map(
                (list_value, ind) => (
                  <li key={ind} className="Main-holder_nav__item"><a href="#" onClick={() => this.flipActiveSystem(ind, list_value.id)} className={"Main-holder_nav__link sub Main-holder__nav__link--button" + (Number(this.subActiveId)===list_value.id ? ' active' : '')}>{list_value.name}</a></li>
                )
              )
            }
          </ul>
        </div>
      </div>
          }
      </div>
    );
  }
}

export default MainCategoryNav;
