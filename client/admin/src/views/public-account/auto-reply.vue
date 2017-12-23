<template>
    <div>
        <crop-image :ratio="3/2"></crop-image>
    </div>
</template>

<<script>
import CropImage from '@/components/CropImage'

export default {
    components: {
        CropImage
    }
}
</script>
