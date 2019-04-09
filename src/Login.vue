<template>
	<div class="login">
		<h2>新闻发布管理后台登录</h2>
		<!-- ref相当于id -->
		<el-form ref='userForm' :rules='rules' :model='form' size='medium' label-position='left'>
			<el-form-item prop='username'>
				<el-input v-model='form.username' placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item prop='password'>
				<el-input v-model='form.password' type='password' placeholder="密码"></el-input>
			</el-form-item>
		</el-form>

		<div class="btns">
			<el-button size='medium' @click='login' type='success' style='width: 100%; margin-top: 15px;'>登录</el-button>
		</div>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				form:{},
				rules:{
					username:[{
						required:true,
						message:'请输入用户名',
						trigger:'blur', // 触发：失焦

					}],
					password:[{
						required:true,
						message:'请输入密码',
						trigger:'blur'
					}]
				}
			}
		},
		methods:{
			login(){
				this.$refs.userForm.validate((valid)=>{
					// 强制校验
					if(valid){
						axios.post('/login',this.form)
						.then(({data:result})=>{
							if(result.status==200&&result.message=='登录成功'){
								// 登陆成功的处理
								// 1.页面跳转
								window.vm.currentComponent='App';
								// 2.用户信息的保存
								localStorage.setItem('user',JSON.stringify(result.data));
							}
						})
						.catch((error)=>{
							this.$notify.error({
								title: '错误',
								message: '网络异常'
							})
						})
					}
				})
				
			},
		}
	}
</script>
<style>
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0px 1000px white inset
		!important;
	}
	html,body {
		height: 100%;
		/*background-color: #f9f9f9;*/
		margin: 0;
		padding: 0;
		overflow-y: auto;
	}
	body {
		background: black url('./assets/bg.jpg');
		background-size: cover;
	}
	.login {
		width: 400px;
		margin: 130px 70px auto auto;
		box-sizing: border-box;
		padding: 100px 50px; 
		/*border: 3px solid red;*/
		border-radius: 10%;
		background-color: rgba(255,255,255,0.6);
	}
	.login h2 {
		text-align: center;
		margin-bottom: 15px;
	}
	.login .btns {
		/*float: right;*/
		text-align: right;
	}
</style>