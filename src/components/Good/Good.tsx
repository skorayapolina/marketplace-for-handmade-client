import './Good.scss'
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom'
import {observer} from 'mobx-react';
import {action, computed, observable} from "mobx";
import {getSellerById} from "../../http/services";
import {ROUTES} from "../../routes/routes";
import {GoodInterface} from "../../stores/helpers/interfaces";
import {STATIC_IMAGES} from "../../http/urls";
import OneGoodStore from "../../stores/OneGoodStore";
import {GoodsContainerPosition} from "../GoodsContainer/GoodsContainer";
import {FormattedMessage} from 'react-intl';
import Modal from "../Modal/Modal";

import {FaRegLemon, FaTrash} from "react-icons/fa";
import SmallButton from "../SmallButton/SmallButton";
import RootStore from "../../stores/RootStore";

@observer
class Good extends Component<{good: GoodInterface, idSeller: string, goodsContainerPosition?: GoodsContainerPosition}> {
    store = new OneGoodStore();
    @observable sellerName = "";

    constructor (props) {
        super(props);
        this.getShopName(this.props.idSeller);
    }

    @action.bound
    async getShopName (id) {
        try {
            const responseSeller = await getSellerById(id);
            this.sellerName = responseSeller.data.name;
        } catch (error) {
            console.log(error);
        }
    }

    @action.bound
    update(id) {
        this.store.update(id);
    }

    @computed
    get elem () {
        return (
            <>
                <form className="createGood-form">
                    <input
                        className = 'createGood-form__input'
                        type='text'
                        name="goodName"
                        onChange={this.store.handleInputChange}
                        placeholder='name'
                        value={this.props.good.name}

                    />
                    <textarea
                        className = 'createGood-form__input'
                        name="description"
                        onChange={this.store.handleInputChange}
                        placeholder='description'
                    />
                    <input
                        className = 'createGood-form__input'
                        type='text'
                        name="price"
                        onChange={this.store.handleInputChange}
                        placeholder='price'
                    />
                    <button onClick={() => this.update(this.props.good._id)}>Update good</button>
                </form>
            </>
        )
    }

    render () {
        const {user} = RootStore;

        return(
                <div
                    className="good"
                    id={this.props.good._id}
                    style={this.props.good.status === "accepted" ? {backgroundColor: "#efefef"} : {backgroundColor: "white"} }
                >
                    {
                        <div className="good__buttons">
                            {
                                this.props.good.idSeller === user.seller._id &&
                                this.props.goodsContainerPosition === GoodsContainerPosition.sellerPage &&
                                <Modal children={this.elem} goodName={this.props.good.name}/>
                            }
                            {
                                this.props.goodsContainerPosition === GoodsContainerPosition.basket &&
                                <>
                                    <button
                                        id={this.props.good.name + "-remove"}
                                        className="removeButton" onClick={() => user.removeFromBasket(this.props.good._id)}
                                    >
                                    </button>
                                    <SmallButton htmlFor={this.props.good.name + "-remove"} icon={<FaTrash/>}/>

                                    <button
                                        id={this.props.good.name + "-addOrder"}
                                        className="addOrderButton"
                                        onClick={() => user.addOrder(user.id, this.props.good._id, this.props.idSeller)}
                                    >
                                    </button>
                                    <SmallButton htmlFor={this.props.good.name + "-addOrder"} icon={<FaRegLemon/>}/>
                                </>
                            }
                            {
                                this.props.goodsContainerPosition === GoodsContainerPosition.orders &&
                                    <p>status: {this.props.good.status}</p>
                            }
                        </div>
                    }



                    <div className="good__image">
                        <NavLink
                            className="good__link-image"
                            to={ROUTES.goods.goods+ this.props.good._id}
                        >
                            <img src={STATIC_IMAGES + this.props.good.image } alt="knitting"/>
                        </NavLink>
                    </div>

                    <div className="good__about">
                        <NavLink
                            to={ROUTES.goods.goods + this.props.good._id}
                            className="good__title good__link"
                        >
                            {this.props.good.name}
                        </NavLink>

                        <div className="good__info">
                            <NavLink
                                to={ROUTES.sellers.sellers + this.props.idSeller}
                                className="good__shop-name good__link"
                            >
                                {this.sellerName}
                            </NavLink>

                            <div className="good__price">{this.props.good.price}$</div>
                        </div>

                        <div className="good__likes">
                            <div>
                                <FormattedMessage id="likes" values={{likes: this.props.good.likes}}/>
                            </div>
                        </div>

                    </div>
                </div>
        )
    }
}

export default Good;
