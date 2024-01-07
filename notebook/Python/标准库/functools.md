关于functools标准库：

> \>>> help(functools)
>
> Help on module functools:
>
>  
>
> NAME
>
>   functools - functools.py - Tools for working with functions and callable objects
>
>  
>
> CLASSES
>
>   builtins.object
>
> ​    partial
>
> ​    partialmethod
>
>  
>
>   class partial(builtins.object)
>
>    | partial(func, *args, **keywords) - new function with partial application
>
>    | of the given arguments and keywords.
>
>    |
>
>    | Methods defined here:
>
>    |
>
>    | __call__(self, /, *args, **kwargs)
>
>    |   Call self as a function.
>
>    |
>
>    | __delattr__(self, name, /)
>
>    |   Implement delattr(self, name).
>
>    |
>
>    | __getattribute__(self, name, /)
>
>    |   Return getattr(self, name).
>
>    |
>
>    | __reduce__(...)
>
>    |   Helper for pickle.
>
>    |
>
>    | __repr__(self, /)
>
>    |   Return repr(self).
>
>    |
>
>    | __setattr__(self, name, value, /)
>
>    |   Implement setattr(self, name, value).
>
>    |
>
>    | __setstate__(...)
>
>    |
>
>    | ----------------------------------------------------------------------
>
>    | Static methods defined here:
>
>    |
>
>    | __new__(*args, **kwargs) from builtins.type
>
>    |   Create and return a new object. See help(type) for accurate signature.
>
>    |
>
>    | ----------------------------------------------------------------------
>
>    | Data descriptors defined here:
>
>    |
>
>    | __dict__
>
>    |
>
>    | args
>
>    |   tuple of arguments to future partial calls
>
>    |
>
>    | func
>
>    |   function object to use in future partial calls
>
>    |
>
>    | keywords
>
>    |   dictionary of keyword arguments to future partial calls
>
>  
>
>   class partialmethod(builtins.object)
>
>    | partialmethod(func, *args, **keywords)
>
>    |
>
>    | Method descriptor with partial application of the given arguments
>
>    | and keywords.
>
>    |
>
>    | Supports wrapping existing descriptors and handles non-descriptor
>
>    | callables as instance methods.
>
>    |
>
>    | Methods defined here:
>
>    |
>
>    | __get__(self, obj, cls)
>
>    |
>
>    | __init__(self, func, *args, **keywords)
>
>    |   Initialize self. See help(type(self)) for accurate signature.
>
>    |
>
>    | __repr__(self)
>
>    |   Return repr(self).
>
>    |
>
>    | ----------------------------------------------------------------------
>
>    | Data descriptors defined here:
>
>    |
>
>    | __dict__
>
>    |   dictionary for instance variables (if defined)
>
>    |
>
>    | __isabstractmethod__
>
>    |
>
>    | __weakref__
>
>    |   list of weak references to the object (if defined)
>
>  
>
> FUNCTIONS
>
>   cmp_to_key(...)
>
> ​    Convert a cmp= function into a key= function.
>
>  
>
>   lru_cache(maxsize=128, typed=False)
>
> ​    Least-recently-used cache decorator.
>
>  
>
> ​    If *maxsize* is set to None, the LRU features are disabled and the cache
>
> ​    can grow without bound.
>
>  
>
> ​    If *typed* is True, arguments of different types will be cached separately.
>
> ​    For example, f(3.0) and f(3) will be treated as distinct calls with
>
> ​    distinct results.
>
>  
>
> ​    Arguments to the cached function must be hashable.
>
>  
>
> ​    View the cache statistics named tuple (hits, misses, maxsize, currsize)
>
> ​    with f.cache_info(). Clear the cache and statistics with f.cache_clear().
>
> ​    Access the underlying function with f.__wrapped__.
>
>  
>
> ​    See: http://en.wikipedia.org/wiki/Cache_algorithms#Least_Recently_Used
>
>  
>
>   reduce(...)
>
> ​    reduce(function, sequence[, initial]) -> value
>
>  
>
> ​    Apply a function of two arguments cumulatively to the items of a sequence,
>
> ​    from left to right, so as to reduce the sequence to a single value.
>
> ​    For example, reduce(lambda x, y: x+y, [1, 2, 3, 4, 5]) calculates
>
> ​    ((((1+2)+3)+4)+5). If initial is present, it is placed before the items
>
> ​    of the sequence in the calculation, and serves as a default when the
>
> ​    sequence is empty.
>
>  
>
>   singledispatch(func)
>
> ​    Single-dispatch generic function decorator.
>
>  
>
> ​    Transforms a function into a generic function, which can have different
>
> ​    behaviours depending upon the type of its first argument. The decorated
>
> ​    function acts as the default implementation, and additional
>
> ​    implementations can be registered using the register() attribute of the
>
> ​    generic function.
>
>  
>
>   total_ordering(cls)
>
> ​    Class decorator that fills in missing ordering methods
>
>  
>
>   update_wrapper(wrapper, wrapped, assigned=('__module__', '__name__', '__qualname__', '__doc__', '__annotations__'), updated=('__dict__',))
>
> ​    Update a wrapper function to look like the wrapped function
>
>  
>
> ​    wrapper is the function to be updated
>
> ​    wrapped is the original function
>
> ​    assigned is a tuple naming the attributes assigned directly
>
> ​    from the wrapped function to the wrapper function (defaults to
>
> ​    functools.WRAPPER_ASSIGNMENTS)
>
> ​    updated is a tuple naming the attributes of the wrapper that
>
> ​    are updated with the corresponding attribute from the wrapped
>
> ​    function (defaults to functools.WRAPPER_UPDATES)
>
>  
>
>   wraps(wrapped, assigned=('__module__', '__name__', '__qualname__', '__doc__', '__annotations__'), updated=('__dict__',))
>
> ​    Decorator factory to apply update_wrapper() to a wrapper function
>
>  
>
> ​    Returns a decorator that invokes update_wrapper() with the decorated
>
> ​    function as the wrapper argument and the arguments to wraps() as the
>
> ​    remaining arguments. Default arguments are as for update_wrapper().
>
> ​    This is a convenience function to simplify applying partial() to
>
> ​    update_wrapper().
>
>  
>
> DATA
>
>   WRAPPER_ASSIGNMENTS = ('__module__', '__name__', '__qualname__', '__do...
>
>   WRAPPER_UPDATES = ('__dict__',)
>
>   __all__ = ['update_wrapper', 'wraps', 'WRAPPER_ASSIGNMENTS', 'WRAPPER_...
>
>  
>
> FILE
>
>   d:\programdata\anaconda3\lib\functools.py

装饰器`functools.total_ordering`可以简化实现让类支持比较的操作，见“类”页面笔记。

任何时候你定义装饰器的时候，都应该使用`functools`库中的 `@wraps` 装饰器来注解底层包装函数。见“元编程”页面笔记。

`functools.partial()`函数就是帮助我们创建一个偏函数的，见“函数”页面笔记。