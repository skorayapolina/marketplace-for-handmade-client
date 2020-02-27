import {action, computed, observable} from 'mobx';
import {instance} from '../http/instance';
import {URLS} from '../http/urls';
import {getBuyerById, getGoodsInBasket, getLikedGoods} from "../http/services";
import jwtDecode from 'jwt-decode';
import {GoodInterface} from "./helpers/interfaces";

const TOKEN = 'token';

class UserStore {
    @observable id: string | undefined;
    @observable name = '';
    @observable email = "";
    @observable password = "";
    @observable role = '';
    @observable basket = [];
    @observable likedGoods =[];

    @observable goodsInBasket: GoodInterface[] = [];
    @observable goodsInLikedGoods: GoodInterface[] =[];

    // @observable basketCost = 0;

    constructor() {
        const accessToken  = this.getAuthTokens();

        if (accessToken) {
            this.init(accessToken);
        }

    }

    @action
    async init(token: string) {
        const authData = jwtDecode(token);

        this.id = authData._id;
        this.name = authData.name;
        this.role = authData.role;

        await this.initBasket();
        await this.initLikedGoods();
    }

    getAuthTokens = () => {
        return localStorage.getItem(TOKEN);
    };

    @computed
    get authenticated() {
        return Boolean(this.name);
    }

    @action.bound
    onChangeEmail(event) {
        this.email = event.target.value;
    }

    @action.bound
    onChangePassword(event) {
        this.password = event.target.value;
    }

    @action.bound
    async loginBuyer(event) {
        event.preventDefault();

        const buyer = {
            email: this.email,
            password: this.password
        };

        try {
            const response = await instance.post(URLS.loginBuyer, buyer);
            localStorage.setItem(TOKEN, response.data);

            this.init(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    @action.bound
    async initBasket() {
        let responseBuyer = await getBuyerById(this.id);
        this.basket = responseBuyer.data.basket;

        this.getGoods(); //get goods after getting the basket
    }

    @action.bound
    async initLikedGoods() {
        let responseBuyer = await getBuyerById(this.id);
        this.likedGoods = responseBuyer.data.likedGoods;
        console.log("responseBuyer.data.likedGoods");
        console.log(responseBuyer.data.likedGoods);
        this.setLikedGoods();
    }

    @action.bound
    async logOutBuyer() {
        localStorage.removeItem(TOKEN);

        this.basket = [];
        this.name = '';
    }

    @action.bound
    async getGoods () {
        try {
            const responseGoods = await getGoodsInBasket(this.id);
            this.goodsInBasket = responseGoods.data;

        } catch (error) {
            console.log(error);

        }
    }

    @action.bound
    async setLikedGoods (){
        try {
            const responseGoods = await getLikedGoods(this.id);
            this.goodsInLikedGoods = responseGoods.data;
            console.log(this.goodsInLikedGoods);
        } catch (error) {
            console.log(error);

        }
    }

    @computed
    get basketCost (){
        let cost = 0;
        this.goodsInBasket.forEach(good => {
            cost += good.price;
        })
        return cost;
    }
}

export {
    UserStore, TOKEN
};
