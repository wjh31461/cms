<template>
  <div class="user">
    <el-button size='medium' @click='toAddUser'>添加用户</el-button>

    <!-- {{multipleSelection}} -->
    <div class="user_tbl" v-loading='loading'>
      <el-table :data="users" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="真实姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope='{row}'>
            <i class="fa fa-trash" @click='deleteUser(row.id)'></i>
            <i class="fa fa-pencil" @click='toUpdateUser(row)'></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    
    <el-dialog :title="uDialog.title" :visible.sync="uDialog.visible">
      <el-form :model="uDialog.form" size='medium' label-position="left">
        <!-- {{uDialog.form}} -->
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="uDialog.form.username" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" label-width="120px">
          <el-input type='password' v-model="uDialog.form.password" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="真实姓名" label-width="120px">
          <el-input v-model="uDialog.form.nickname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="uDialog.form.email" autocomplete="off"></el-input>
        </el-form-item>
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size='medium' @click='closeUDialog'>取 消</el-button>
        <el-button type="primary" size='medium' @click='saveOrUpdateUser(uDialog.form.id)'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    created(){
      this.loadAllUser();
    },
    data(){
      return {
        loading:false,
        users:[],
        multipleSelection:[],
        uDialog:{
          title:'',
          visible:false,
          form:{
            
          }
        },
      }
    },
    methods:{
     /* batchDeleteUser(){
        let ids = this.multipleSelection.map((item)=>{
          return item.id;
        });
        if(ids==''){
          this.$alert('请选择用户', '', {
            confirmButtonText: 'OK',
          });
        }else{
          this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
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
      },*/
      /*加载数据*/
      loadAllUser(){
        this.loading=true;
        axios.get('/manager/user/findAllUser')
        .then(({data:result})=>{
          this.users = result.data;
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*删除用户*/
      deleteUser(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          axios.get('/manager/user/deleteUserById?id='+id)
          .then(()=>{
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            });
            this.loadAllUser();
          })
          .catch(()=>{
            this.$notify.error({
              title: '错误',
              message: '删除失败！'
            });
          });
        });
      },
      /*点击新增显示模态框*/
      toAddUser(){
        this.uDialog.form={};
        this.uDialog.title='添加用户';
        this.uDialog.visible=true;
      },
      /*关闭模态框并清空数据*/
      closeUDialog(){
        this.uDialog.visible=false;
        this.uDialog.form={};
      },
      /*提交数据*/
      saveOrUpdateUser(id){
        if(this.uDialog.form.username==null||this.uDialog.form.username==''){
          this.$alert('请输入用户名', '', {
            confirmButtonText: 'OK',
          });
        }else{
          if(this.uDialog.form.password==null||this.uDialog.form.password==''){
            this.$alert('请输入密码', '', {
              confirmButtonText: 'OK',
            });
          }else{
            let obj = {
              id:this.uDialog.form.id,
              username:this.uDialog.form.username,
              nickname:this.uDialog.form.nickname,
              email:this.uDialog.form.email,
              password:this.uDialog.form.password
            };
            axios.post('/manager/user/saveOrUpdateUser',obj)
            .then(()=>{
              this.$notify({
                title: '成功',
                message: '提交成功！',
                type: 'success'
              });
              this.closeUDialog();
              this.loadAllUser();
            })
            .catch(()=>{
              this.$notify.error({
                title: '失败',
                message: '提交失败！'
              });
            });
          }
        }
      },
      /*保存数据显示模态框*/
      toUpdateUser(row){
        this.uDialog.title='修改用户信息';
        this.uDialog.form=row;
        this.uDialog.visible=true;
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
</style>