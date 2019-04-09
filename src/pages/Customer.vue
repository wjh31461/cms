<template>
	<div class="customer">
		顾客 {{id}}
	</div>
</template>
<script>
	export default {
		watch:{
      '$route':function(to,from){
        //console.log('to:',to);
        this.id = to.params.id;
      }
    },
		data(){
			return {
				id:0
			}
		},
		mounted(){
			console.log(this.$route);
			console.log(this.$router);
			this.id = this.$route.params.id;
			//alert(this.$route.params.id);
			//console.log(this.$route);
			this.$router.push('/user');
		}
	}
</script>