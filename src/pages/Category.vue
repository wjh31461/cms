<template>
	<div class="category">
		<!-- 按钮区 -->
		<div class="btns">
			<el-button size='medium' @click='toAddCategory'>新增</el-button>
			<el-button size='medium' type='danger' @click='batchDeleteCategory'>批量删除栏目</el-button>
		</div>
		<!-- 按钮区结束 -->
		
		<!-- 栏目管理表格 -->
		<div class="category_tbl" v-loading='loading'>
			<el-table :data="categories"
				style="width: 100%" size='medium' :border='true'
				@selection-change="handleSelectionChange">
				<el-table-column
		      type="selection"
		      width="40">
		    </el-table-column>
		    <el-table-column
	        prop="id"
	        label="编号"
	        width="60">
	      </el-table-column>
	      <el-table-column
	        prop="name"
	        label="栏目名称"
	        width="150">
	      </el-table-column>
	      <el-table-column
	        prop="parent.name"
	        label="父栏目"
	        width="150">
	      </el-table-column>
	      <el-table-column
	        prop="comment"
	        label="描述">
	      </el-table-column>
	      <el-table-column label="操作" width='80'>
	        <template slot-scope='{row}'>
	        	<i class="fa fa-trash" @click='deleteCategory(row.id)'></i>
	        	<i class="fa fa-pencil" @click='toUpdateCategory(row)'></i>
	        </template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 栏目管理结束 -->
		
		<!-- 模态框 -->
		<el-dialog :title="cDialog.title" :visible.sync="cDialog.visible">
		  <el-form :model="cDialog.form" size='medium' label-position="left">
		    <el-form-item label="栏目名称" label-width="100px">
		      <el-input v-model="cDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="父栏目" label-width="100px">
		      <el-select v-model="cDialog.form.parentId" placeholder="一级栏目">
		        <el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="栏目描述" label-width="100px">
		      <el-input v-model="cDialog.form.comment"
		      	type="textarea" :rows="2"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='medium' @click='closeCDialog'>取 消</el-button>
		    <el-button type="primary" size='medium' @click='saveOrUpdateCategory'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				loading:false,
				categories:[],
				multipleSelection:[],
				cDialog:{
					title:'',
					visible:false,
					form:{
						
					}
				}
			}
		},
		created(){
			// 查询所有栏目信息
			this.findAllCategories();
		},
		mounted(){
			
		},
		methods:{
			findAllCategories(){
				this.loading=true;
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories=result.data;
				})
				.catch(()=>{
					this.$notify.error({
	          title: '错误',
	          message: '网络异常！'
	        });
				})
				.finally(()=>{
					this.loading=false;
				})
			},
			deleteCategory(id){
				this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/manager/category/deleteCategoryById?id='+id)
					.then(()=>{
						this.$notify({
		          title: '成功',
		          message: '删除成功！',
		          type: 'success'
		        });
		        this.findAllCategories();
					})
					.catch(()=>{
						this.$notify.error({
		          title: '错误',
		          message: '删除失败！'
		        });
					});
        });
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			batchDeleteCategory(){
				let ids=this.multipleSelection.map((item)=>{
					return item.id;
				});
				if(ids==''){
					this.$alert('请选择栏目', '', {
	          confirmButtonText: 'OK',
	        });
				}else{
					this.$confirm('此操作将永久删除这些栏目, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        })
	        .then(()=>{
						axios.post('/manager/category/batchDeleteCategory',{ids})
						.then(()=>{
							this.$notify({
			          title: '成功',
			          message: '删除成功！',
			          type: 'success'
			        });
			        this.findAllCategories();
						})
						.catch(()=>{
							this.$notify.error({
			          title: '错误',
			          message: '删除失败！'
			        });
						});
	        })
				}
			},
			toAddCategory(){
				this.cDialog.form={};
				this.cDialog.title='添加栏目';
				this.cDialog.visible=true;
			},
			closeCDialog(){
				this.cDialog.visible=false;
				this.cDialog.form={};
			},
			saveOrUpdateCategory(){
				if(this.cDialog.form.name==null||this.cDialog.form.name==''){
	        this.$alert('请输入栏目名称', '', {
	          confirmButtonText: 'OK',
	        });
				}else{
					axios.post('/manager/category/saveOrUpdateCategory',this.cDialog.form)
					.then(({data:result})=>{
						if(result.status==200){
							this.$notify({
			          title: '成功',
			          message: '提交成功！',
			          type: 'success'
			        });
			        this.closeCDialog();
			        this.findAllCategories();
						}else{
							this.$notify.error({
			          title: '失败',
			          message: '提交失败！'
			        });
						}
					})
					.catch((error)=>{
						this.$notify.error({
							title: '错误',
							message: '网络异常！'
						})
					})
				}
			},
			toUpdateCategory(row){
				// 处理数据
				let category=_.clone(row);
				category.parentId=category.parent?category.parent.id:undefined;
				delete category.parent;
				
				// 双向数据绑定
				this.cDialog.form=category;

				this.cDialog.title='修改栏目';
				// this.cDialog.form=row;
				this.cDialog.visible=true;
			},
		}
	}
</script>

<style>
	.btns {
		margin-bottom: .5em;
	}
	i.fa {
		margin: 0 .3em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
</style>