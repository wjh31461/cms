import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials=true;
axios.defaults.baseURL='http://120.79.32.17:8888'
// axios.defaults.baseURL='http://120.79.32.17:8099'
// axios.defaults.baseURL='http://120.78.164.247:8888'

axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use((config)=>{
	if(config.method==='post'){
		config.data=qs.stringify(config.data,{arrayFormat:'repeat'});
	}
	return config;
});
/*在请求每次回来的时候先判断回应信息中是否包含了未登录信息
	如果包含，直接跳转到登录页面
	否则正常进行*/
axios.interceptors.response.use((response)=>{
	if(response&&response.data.status==500&&response.data.message=='尚未登录，请登录!'){
		window.vm.currentComponent='Login';
	}
	return response;
})

export default axios;