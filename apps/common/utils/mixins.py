# apps/common/mixins.py
from apps.common.utils.caching import CacheHelper

class CachingMixin:
    """
    Reusable mixin for ViewSets that provides caching functionality
    """
    cache_timeout = CacheHelper.DEFAULT_TIMEOUT
    long_cache_timeout = CacheHelper.LONG_CACHE_TIMEOUT
    
    def get_cache_timeout(self):
        """Override this to customize cache timeout per view"""
        return self.cache_timeout

    def perform_create(self, serializer):
        """Invalidate caches after create"""
        super().perform_create(serializer)
        self._invalidate_instance_caches(serializer.instance)

    def perform_update(self, serializer):
        """Invalidate caches after update"""
        super().perform_update(serializer)
        self._invalidate_instance_caches(serializer.instance)

    def perform_destroy(self, instance):
        """Invalidate caches after delete"""
        super().perform_destroy(instance)
        self._invalidate_instance_caches(instance)

    def _invalidate_instance_caches(self, instance):
        """Invalidate all caches for this instance"""
        cache_keys = CacheHelper.get_model_cache_keys(instance, self.__class__)
        CacheHelper.invalidate_keys(*cache_keys)
        
    @classmethod
    def cached_method(cls, timeout=None, vary_on_user=True):
        """
        Decorator for caching ViewSet methods
        """
        return CacheHelper.cached_view(
            timeout=timeout or cls.cache_timeout,
            vary_on_user=vary_on_user
        )