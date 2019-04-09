<template>
	<div class="article">
		<!-- 按钮 -->
		<div class="btns">
			<el-select v-model="params.categoryId" size="medium" clearable placeholder="请选择栏目" style="width: 150px">
		    <el-option v-for="c in categories" :value="c.id" :key="c.id" :label='c.name'>
		    </el-option>
		  </el-select>
		  
		  <el-input
			  placeholder="请输入标题关键字"
			  v-model="params.keywords"
			  style="width: 220px"
			  size="medium"
			  clearable>
			  <el-button slot="append" icon="el-icon-search" size="medium"></el-button>
			</el-input>

			<el-button size='medium' @click='batchDeleteArticle' type='danger' style="float: right">批量删除文章</el-button>
			<el-button size='medium' @click='toAddArticle' style="float: right;margin-right: 20px">添加文章</el-button>
		</div>
		
		<!-- 列表 -->
		<div class="article_tbl" v-loading='loading'>
			{{multipleSelection}}
			<el-table :data="articles" style="width: 100%" size='medium' :border='true'
			@selection-change="handleSelectionChange">
				<el-table-column
		      type="selection"
		      width="40"
		      fixed='left'>
		    </el-table-column>
		    <!-- <el-table-column
		    	        prop="id"
		    	        label="编号"
		    	        width="60"
		    	        align='center'>
		    	      </el-table-column> -->
	      <el-table-column
	        prop="title"
	        label="文章标题"
	        width="300">
	      </el-table-column>
	      <el-table-column
	        prop="category.name"
	        label="所属栏目"
	        width="120"
	        align='center'>
	      </el-table-column>
	      <el-table-column
	        prop="liststyle"
	        label="列表样式"
	        width="120"
	        align='center'>
	      </el-table-column>
	      <el-table-column
	        prop="publishtime"
	        label="发布时间"
	        width="180"
	        align='center'>
	      </el-table-column>
	      <el-table-column
	        prop="readtimes"
	        label="阅读次数"
	        width="100"
	        align='center'>
	      </el-table-column>
	      <el-table-column
	        prop="author"
	        label="作者">
	      </el-table-column>
	      <el-table-column label="操作" width='80' fixed='right' align='center'>
	        <template slot-scope='{row}'>
	        	<i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
	        	<i class="fa fa-pencil" @click='toUpdateArticle(row)'></i>
	        </template>
	      </el-table-column>
	    </el-table>
		</div>
		
		<!-- 翻页 -->
		<div class="page">
			<el-pagination
		    layout="prev, pager, next"
		    :page-size='params.pageSize'
		    @current-change='handleCurrentChange'
		    :total="total">
		  </el-pagination>
		</div>

		<!-- 模态框 -->
		<el-dialog fullscreen :title="aDialog.title" :visible.sync="aDialog.visible">
		  {{aDialog.form}}
		  <el-form :model="aDialog.form" label-position="left">
		    <el-form-item label="文章标题" label-width="100px">
		      <el-input v-model="aDialog.form.title" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-row>
		    	<el-col :span='12'>
		    		<el-form-item label="所属栏目" label-width="100px">
				      <el-select v-model="aDialog.form.categoryId" placeholder="请选择所属栏目" style='width: 80%'>
				        <el-option v-for='c in categories' :key='c.id' :label='c.name' :value='c.id'></el-option>
				      </el-select>
				    </el-form-item>
		    	</el-col>
		    	<el-col :span='12'>
		    		<el-form-item label="列表样式" label-width="100px">
				      <ul class="list_style">
				      	<li class='style_one' :class="{current:aDialog.form.liststyle=='style-one'}" @click="aDialog.form.liststyle='style-one'">
				      		<img src="@/assets/style_one.jpg" alt="">
				      	</li>
				      	<li class='style_two' :class='{current:aDialog.form.liststyle=="style-two"}' @click='aDialog.form.liststyle="style-two"'>
				      		<img src="@/assets/style_two.jpg" alt="">
				      	</li>
				      </ul>
				    </el-form-item>
		    	</el-col>
		    </el-row>
 		    
		    <el-form-item label="缩略图" label-width="6em">
					<el-upload
					  action="http://120.79.32.17:8099/manager/file/upload"
					  :file-list='aDialog.fileList'
					  :on-success='handleUploadSuccess'
					  :on-remove='handleFileRemove'
					  list-type="picture">
					  <el-button size="medium" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>

		    </el-form-item>
		    <el-form-item label="文章正文" label-width="100px">
		      <!-- <el-input v-model="aDialog.form.content" type="textarea" :rows='6' autocomplete="off"></el-input> -->
		      <mavon-editor ref='aContent' v-model="aDialog.form.content"/></mavon-editor>
		    </el-form-item>
		  </el-form>
		  
		  <div slot="footer" class="dialog-footer">
		    <el-button size='medium' @click='closeADialog'>取 消</el-button>
		    <el-button size='medium' type="primary" @click='saveOrUpdateArticle'>确 定</el-button>
		  </div>
		</el-dialog>


		
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				loading:false,
				articles:[],
				categories:[],
				multipleSelection:[],
				total:10,
				fileList:[],
				aDialog:{
					title:'',
					visible:false,
					form:{
						liststyle:'style-one',
						fileIds:[]
					}
				},
				params:{
					page:0,
					pageSize:10,
				}
			}
		},
		watch:{
			params:{
				handler:function(){
					this.findAllArticles();
				},
				deep:true
			}
		},
		created(){
			this.findAllArticles();
			this.findAllCategories();
		},
		methods:{
			handleSelectionChange(val){
				this.multipleSelection=val;
			},
			handleUploadSuccess(response,file,fileList){
				// 将文件名为文件的id
				file.name=response.data.id;
				this.aDialog.form.fileIds.push(response.data.id);
			},
			handleFileRemove(file){
				// 1.通过id删除附件
				axios.get('/manager/file/delete',{
					params:{
						id:file.name
					}
				})
				.then(()=>{
					this.$notify({
	          title: '成功',
	          message: '删除成功！',
	          type: 'success'
	        });
	        // 2.从fileIds中挪出
	        _.remove(this.aDialog.form.fileIds,(id)=>{
						return id==file.name
	        })
	        this.aDialog.form.fileIds.push(1);
	        this.aDialog.form.fileIds.pop();
				})
				.catch(()=>{
					this.$notify.error({
	          title: '失败',
	          message: '删除失败！'
	        });
				})
			},
			findAllArticles(){
				this.loading=true;
				axios.get('/manager/article/findArticle',{
					params:this.params
				})
				.then(({data:result})=>{
					this.total=result.data.total;
					this.articles=result.data.list;
				})
				.catch(()=>{
					this.$notify.error({
						title: '错误',
	          message: '网络异常！'
					})
				})
				.finally(()=>{
					this.loading=false;
				})
			},
			findAllCategories(){
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
			},
			deleteArticle(id){
				this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/manager/article/deleteArticleById?id='+id)
					.then(()=>{
						this.$notify({
		          title: '成功',
		          message: '删除成功！',
		          type: 'success'
		        });
		        this.findAllArticles();
					})
					.catch(()=>{
						this.$notify.error({
		          title: '错误',
		          message: '删除失败！'
		        });
					});
        })
			},
			toUpdateArticle(row){
				// 2.克隆当前行数据，避免错误修改
				let article=_.cloneDeep(row);

				// 3.处理附件的默认显示
				this.aDialog.fileList=article.articleFileVMs.map((item)=>{
					return {
						name:item.cmsFile.id,
						url:'http://134.175.154.93:8888/group1/'+item.cmsFile.id
					}
				})

				// 4.1 删除category,添加categoryId
				article.categoryId=article.category.id;
				delete article.category;
				
				// 4.2删除articleFileVMs，添加fileIds
				article.fileIds=article.articleFileVMs.map(item=>item.cmsFile.id)
				delete article.articleFileVMs;
				
				// 4.3 将值为null属性删除，取消默认空值
				for(let key in article){
					let val=article[key];
					if(!val){
						delete article[key];
					}
				}
				// 5.将处理后的结果与表单双向绑定
				this.aDialog.form=article;

				this.aDialog.title='修改文章信息';
				this.aDialog.visible=true
			},
			handleCurrentChange(page){
				this.params.page=page-1;
			},
			toAddArticle(){
				this.aDialog.form={
					liststyle:'style-one',
					fileIds:[]
				};
				// 重置附件列表
				this.fileList=[];
				this.aDialog.title='添加文章';
				this.aDialog.visible=true
			},
			closeADialog(){
				this.aDialog.visible=false;
			},
			batchDeleteArticle(){
				let ids=this.multipleSelection.map((item)=>{
					return item.id
				});
				if(ids==''){
					this.$alert('请选择要删除的文章', '', {
	          confirmButtonText: 'OK',
	        });
				}else{
					this.$confirm('此操作将永久删除这些文章, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        })
					.then(()=>{
						axios.post('/manager/article/batchDeleteArticle',{ids})
						.then(()=>{
							this.$notify({
			          title: '成功',
			          message: '删除成功！',
			          type: 'success'
			        });
			        this.findAllArticles();
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
			saveOrUpdateArticle(){
				// $refs方便拿到所有的引用
				// console.log(_.clone(this.$refs.aContent));

				if(this.aDialog.form.title==null||this.aDialog.form.title==''){
					this.$alert('请输入文章标题', '', {
	          confirmButtonText: 'OK',
	        });
				}else{
					if(this.aDialog.form.categoryId==null){
						this.$alert('请选择文章所属栏目', '', {
		          confirmButtonText: 'OK',
		        });
					}else{
						// 将html代码绑定到form.source上
						this.aDialog.form.source=this.$refs.aContent.d_render;
						
						axios.post('/manager/article/saveOrUpdateArticle',this.aDialog.form)
						.then(({data:result})=>{
							if(result.status==200){
								this.$notify({
				          title: '成功',
				          message: '提交成功！',
				          type: 'success'
				        });
				        this.closeADialog();
				        this.findAllArticles();
							}else{
								this.$notify.error({
				          title: '失败',
				          message: '提交失败！'
				        });
							}
						})
						.catch((error)=>{
							this.$notify.error({
								title: '失败',
								message: '网络异常！'
							})
						})
					}
				}
			}
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
	.el-dialog__body {
		padding: 0 20px;
	}
	.list_style >li {
		width: 200px;
		height: 80px;
		border: 1px solid #ededed;
		border-radius: 3px;
		padding: .5em;
	}
	.list_style >li.current {
		border-color: #409eff;
	}
	.list_style >li img {
		width: 100%;
	}
	.list_style >li.style_one {
		float: left;
	}
	.list_style >li.style_two {
		margin-left: 220px;
	}
</style>