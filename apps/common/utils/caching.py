# apps/common/utils/caching.py
from django.core.cache import cache
from django.utils import timezone
from functools import wraps
import logging
from hashlib import md5
from rest_framework.response import Response as DRF_Response 

logger = logging.getLogger('cache')

class CacheHelper:
    """
    Reusable caching helper class with advanced features
    """
    DEFAULT_TIMEOUT = 60 * 15  # 15 minutes
    LONG_CACHE_TIMEOUT = 60 * 60 * 2  # 2 hours
    
    @classmethod
    def generate_cache_key(cls, view_instance, prefix, pk=None, filters=None, user=None):
        """
        Generate a unique cache key based on:
        - View class name
        - Prefix
        - PK
        - Filters
        - User (if provided)
        """
        key_parts = [
            view_instance.__class__.__name__,
            prefix,
            str(pk) if pk else ''
        ]

        if filters:
            key_parts.extend(f"{k}={v}" for k, v in sorted(filters.items()) if v)
        if user and user.is_authenticated:
            key_parts.append(f"user={user.pk}")

        key_string = ":".join(key_parts)
        return f"cache_{md5(key_string.encode()).hexdigest()}"

    @classmethod
    def cached_view(cls, timeout=None, vary_on_user=True):
        """
        Decorator for caching views/methods with automatic key generation.
        Ensures DRF Response is rendered before caching.
        """
        def decorator(view_func):
            @wraps(view_func)
            def wrapped_view(view_instance, request, *args, **kwargs):
                cache_key = cls.generate_cache_key(
                    view_instance,
                    view_func.__name__,
                    pk=kwargs.get('pk'),
                    filters=request.GET.dict(),
                    user=request.user if vary_on_user else None
                )
                
                response = cache.get(cache_key)
                if response is not None:
                    logger.debug(f"Cache hit for {cache_key}")
                    if isinstance(response, DRF_Response) and not response.is_rendered:
                        response.render() 
                    return response
                
                logger.debug(f"Cache miss for {cache_key}")
                response = view_func(view_instance, request, *args, **kwargs)
                
                if isinstance(response, DRF_Response) and not response.is_rendered:
                    try:
                        response.render()
                    except Exception as e:
                        logger.error(f"Failed to render DRF Response for caching: {e}")
                        return response

                cache.set(cache_key, response, timeout or cls.DEFAULT_TIMEOUT)
                return response
            return wrapped_view
        return decorator

    @classmethod
    def invalidate_keys(cls, *cache_keys):
        """Invalidate multiple cache keys at once"""
        cache.delete_many([k for k in cache_keys if k])
        logger.info(f"Invalidated cache keys: {cache_keys}")

    @classmethod
    def get_model_cache_keys(cls, instance, view_class=None):
        """
        Generate all potential cache keys for a model instance
        """
        model_name = instance._meta.model_name
        view_class_name = view_class.__name__ if view_class else ''

        keys = [
            cls.generate_cache_key(
                view_class or instance, f"{model_name}_detail", pk=instance.pk
            )
        ]

        keys.append(cls.generate_cache_key(view_class or instance, f"{model_name}s"))

        if hasattr(instance, 'country') and instance.country: 
            keys.append(cls.generate_cache_key(
                view_class or instance,
                f"{model_name}s",
                filters={'country_id': instance.country.pk}
            ))
        if hasattr(instance, 'province') and instance.province:
            keys.append(cls.generate_cache_key(
                view_class or instance,
                f"{model_name}s",
                filters={'province_id': instance.province.pk}
            ))
        if hasattr(instance, 'city') and instance.city:
            keys.append(cls.generate_cache_key(
                view_class or instance,
                f"{model_name}s",
                filters={'city_id': instance.city.pk}
            ))

        if model_name in ['country', 'province', 'city', 'suburb']:
            keys.append(cls.generate_cache_key(
                view_class or instance,
                "location_hierarchy"
            ))

        return [k for k in keys if k]