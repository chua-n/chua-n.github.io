## PropertyEditor 接口

PropertyEditor是属性编辑器的接口，它规定了将外部设置值转换为内部JavaBean属性值的转换接口方法。PropertyEditor主要的接口方法说明如下：

- `Object getValue()`：返回属性的当前值，基本类型被封装成对应的包装类实例；
- `void setValue(Object newValue)`：设置属性的值，基本类型以包装类传入（自动装箱）；
- `String getAsText()`：将属性对象用一个字符串表示，以便外部的属性编辑器能以可视化的方式显示。缺省返回null，表示该属性不能以字符串表示；
- `void setAsText(String text)`：用一个字符串去更新属性的内部值，这个字符串一般从外部属性编辑器传入；
- `String[] getTags()`：返回表示有效属性值的字符串数组（如boolean属性对应的有效Tag为true和false），以便属性编辑器能以下拉框的方式显示出来。缺省返回null，表示属性没有匹配的字符值有限集合；
- `String getJavaInitializationString()`：为属性提供一个表示初始值的字符串，属性编辑器以此值作为属性的默认值。

```java
package java.beans;

/**
 * A PropertyEditor class provides support for GUIs that want to
 * allow users to edit a property value of a given type.
 * <p>
 * PropertyEditor supports a variety of different kinds of ways of
 * displaying and updating property values.  Most PropertyEditors will
 * only need to support a subset of the different options available in
 * this API.
 * <P>
 * Simple PropertyEditors may only support the getAsText and setAsText
 * methods and need not support (say) paintValue or getCustomEditor.  More
 * complex types may be unable to support getAsText and setAsText but will
 * instead support paintValue and getCustomEditor.
 * <p>
 * Every propertyEditor must support one or more of the three simple
 * display styles.  Thus it can either (1) support isPaintable or (2)
 * both return a non-null String[] from getTags() and return a non-null
 * value from getAsText or (3) simply return a non-null String from
 * getAsText().
 * <p>
 * Every property editor must support a call on setValue when the argument
 * object is of the type for which this is the corresponding propertyEditor.
 * In addition, each property editor must either support a custom editor,
 * or support setAsText.
 * <p>
 * Each PropertyEditor should have a null constructor.
 */
public interface PropertyEditor {

    /**
     * Set (or change) the object that is to be edited.  Primitive types such
     * as "int" must be wrapped as the corresponding object type such as
     * "java.lang.Integer".
     *
     * @param value The new target object to be edited.  Note that this
     *     object should not be modified by the PropertyEditor, rather
     *     the PropertyEditor should create a new object to hold any
     *     modified value.
     */
    void setValue(Object value);

    /**
     * Gets the property value.
     *
     * @return The value of the property.  Primitive types such as "int" will
     * be wrapped as the corresponding object type such as "java.lang.Integer".
     */

    Object getValue();

    //----------------------------------------------------------------------

    /**
     * Determines whether this property editor is paintable.
     *
     * @return  True if the class will honor the paintValue method.
     */

    boolean isPaintable();

    /**
     * Paint a representation of the value into a given area of screen
     * real estate.  Note that the propertyEditor is responsible for doing
     * its own clipping so that it fits into the given rectangle.
     * <p>
     * If the PropertyEditor doesn't honor paint requests (see isPaintable)
     * this method should be a silent noop.
     * <p>
     * The given Graphics object will have the default font, color, etc of
     * the parent container.  The PropertyEditor may change graphics attributes
     * such as font and color and doesn't need to restore the old values.
     *
     * @param gfx  Graphics object to paint into.
     * @param box  Rectangle within graphics object into which we should paint.
     */
    void paintValue(java.awt.Graphics gfx, java.awt.Rectangle box);

    //----------------------------------------------------------------------

    /**
     * Returns a fragment of Java code that can be used to set a property
     * to match the editors current state. This method is intended
     * for use when generating Java code to reflect changes made through the
     * property editor.
     * <p>
     * The code fragment should be context free and must be a legal Java
     * expression as specified by the JLS.
     * <p>
     * Specifically, if the expression represents a computation then all
     * classes and static members should be fully qualified. This rule
     * applies to constructors, static methods and non primitive arguments.
     * <p>
     * Caution should be used when evaluating the expression as it may throw
     * exceptions. In particular, code generators must ensure that generated
     * code will compile in the presence of an expression that can throw
     * checked exceptions.
     * <p>
     * Example results are:
     * <ul>
     * <li>Primitive expresssion: <code>2</code>
     * <li>Class constructor: <code>new java.awt.Color(127,127,34)</code>
     * <li>Static field: <code>java.awt.Color.orange</code>
     * <li>Static method: <code>javax.swing.Box.createRigidArea(new
     *                                   java.awt.Dimension(0, 5))</code>
     * </ul>
     *
     * @return a fragment of Java code representing an initializer for the
     *         current value. It should not contain a semi-colon
     *         ('<code>;</code>') to end the expression.
     */
    String getJavaInitializationString();

    //----------------------------------------------------------------------

    /**
     * Gets the property value as text.
     *
     * @return The property value as a human editable string.
     * <p>   Returns null if the value can't be expressed as an editable string.
     * <p>   If a non-null value is returned, then the PropertyEditor should
     *       be prepared to parse that string back in setAsText().
     */
    String getAsText();

    /**
     * Set the property value by parsing a given String.  May raise
     * java.lang.IllegalArgumentException if either the String is
     * badly formatted or if this kind of property can't be expressed
     * as text.
     * @param text  The string to be parsed.
     */
    void setAsText(String text) throws java.lang.IllegalArgumentException;

    //----------------------------------------------------------------------

    /**
     * If the property value must be one of a set of known tagged values,
     * then this method should return an array of the tags.  This can
     * be used to represent (for example) enum values.  If a PropertyEditor
     * supports tags, then it should support the use of setAsText with
     * a tag value as a way of setting the value and the use of getAsText
     * to identify the current value.
     *
     * @return The tag values for this property.  May be null if this
     *   property cannot be represented as a tagged value.
     *
     */
    String[] getTags();

    //----------------------------------------------------------------------

    /**
     * A PropertyEditor may choose to make available a full custom Component
     * that edits its property value.  It is the responsibility of the
     * PropertyEditor to hook itself up to its editor Component itself and
     * to report property value changes by firing a PropertyChange event.
     * <P>
     * The higher-level code that calls getCustomEditor may either embed
     * the Component in some larger property sheet, or it may put it in
     * its own individual dialog, or ...
     *
     * @return A java.awt.Component that will allow a human to directly
     *      edit the current property value.  May be null if this is
     *      not supported.
     */

    java.awt.Component getCustomEditor();

    /**
     * Determines whether this property editor supports a custom editor.
     *
     * @return  True if the propertyEditor can provide a custom editor.
     */
    boolean supportsCustomEditor();

    //----------------------------------------------------------------------

    /**
     * Adds a listener for the value change.
     * When the property editor changes its value
     * it should fire a {@link PropertyChangeEvent}
     * on all registered {@link PropertyChangeListener}s,
     * specifying the {@code null} value for the property name
     * and itself as the source.
     *
     * @param listener  the {@link PropertyChangeListener} to add
     */
    void addPropertyChangeListener(PropertyChangeListener listener);

    /**
     * Removes a listener for the value change.
     *
     * @param listener  the {@link PropertyChangeListener} to remove
     */
    void removePropertyChangeListener(PropertyChangeListener listener);

}
```

可以看出`PropertyEditor`接口方法是内部属性值和外部设置值的沟通桥梁。此外，我们可以很容易地发现该接口的很多方法是专为GUI中的可视化属性编辑器提供的：如`getTags()`、`getJavaInitializationString()`等等。

## PropertyEditorSupport 实现类

Java为`PropertyEditor`提供了一个方便的实现类：`PropertyEditorSupport`，该类实现了`PropertyEditor`接口并提供默认实现，一般情况下，用户可以通过扩展这个方便类设计自己的属性编辑器。

```java
package java.beans;

import java.beans.*;

/**
 * This is a support class to help build property editors.
 * <p>
 * It can be used either as a base class or as a delegate.
 */

public class PropertyEditorSupport implements PropertyEditor {

    /**
     * Constructs a <code>PropertyEditorSupport</code> object.
     *
     * @since 1.5
     */
    public PropertyEditorSupport() {
        setSource(this);
    }

    /**
     * Constructs a <code>PropertyEditorSupport</code> object.
     *
     * @param source the source used for event firing
     * @since 1.5
     */
    public PropertyEditorSupport(Object source) {
        if (source == null) {
           throw new NullPointerException();
        }
        setSource(source);
    }

    /**
     * Returns the bean that is used as the
     * source of events. If the source has not
     * been explicitly set then this instance of
     * <code>PropertyEditorSupport</code> is returned.
     *
     * @return the source object or this instance
     * @since 1.5
     */
    public Object getSource() {
        return source;
    }

    /**
     * Sets the source bean.
     * <p>
     * The source bean is used as the source of events
     * for the property changes. This source should be used for information
     * purposes only and should not be modified by the PropertyEditor.
     *
     * @param source source object to be used for events
     * @since 1.5
     */
    public void setSource(Object source) {
        this.source = source;
    }

    /**
     * Set (or change) the object that is to be edited.
     *
     * @param value The new target object to be edited.  Note that this
     *     object should not be modified by the PropertyEditor, rather
     *     the PropertyEditor should create a new object to hold any
     *     modified value.
     */
    public void setValue(Object value) {
        this.value = value;
        firePropertyChange();
    }

    /**
     * Gets the value of the property.
     *
     * @return The value of the property.
     */
    public Object getValue() {
        return value;
    }

    //----------------------------------------------------------------------

    /**
     * Determines whether the class will honor the paintValue method.
     *
     * @return  True if the class will honor the paintValue method.
     */

    public boolean isPaintable() {
        return false;
    }

    /**
     * Paint a representation of the value into a given area of screen
     * real estate.  Note that the propertyEditor is responsible for doing
     * its own clipping so that it fits into the given rectangle.
     * <p>
     * If the PropertyEditor doesn't honor paint requests (see isPaintable)
     * this method should be a silent noop.
     *
     * @param gfx  Graphics object to paint into.
     * @param box  Rectangle within graphics object into which we should paint.
     */
    public void paintValue(java.awt.Graphics gfx, java.awt.Rectangle box) {
    }

    //----------------------------------------------------------------------

    /**
     * This method is intended for use when generating Java code to set
     * the value of the property.  It should return a fragment of Java code
     * that can be used to initialize a variable with the current property
     * value.
     * <p>
     * Example results are "2", "new Color(127,127,34)", "Color.orange", etc.
     *
     * @return A fragment of Java code representing an initializer for the
     *          current value.
     */
    public String getJavaInitializationString() {
        return "???";
    }

    //----------------------------------------------------------------------

    /**
     * Gets the property value as a string suitable for presentation
     * to a human to edit.
     *
     * @return The property value as a string suitable for presentation
     *       to a human to edit.
     * <p>   Returns null if the value can't be expressed as a string.
     * <p>   If a non-null value is returned, then the PropertyEditor should
     *       be prepared to parse that string back in setAsText().
     */
    public String getAsText() {
        return (this.value != null)
                ? this.value.toString()
                : null;
    }

    /**
     * Sets the property value by parsing a given String.  May raise
     * java.lang.IllegalArgumentException if either the String is
     * badly formatted or if this kind of property can't be expressed
     * as text.
     *
     * @param text  The string to be parsed.
     */
    public void setAsText(String text) throws java.lang.IllegalArgumentException {
        if (value instanceof String) {
            setValue(text);
            return;
        }
        throw new java.lang.IllegalArgumentException(text);
    }

    //----------------------------------------------------------------------

    /**
     * If the property value must be one of a set of known tagged values,
     * then this method should return an array of the tag values.  This can
     * be used to represent (for example) enum values.  If a PropertyEditor
     * supports tags, then it should support the use of setAsText with
     * a tag value as a way of setting the value.
     *
     * @return The tag values for this property.  May be null if this
     *   property cannot be represented as a tagged value.
     *
     */
    public String[] getTags() {
        return null;
    }

    //----------------------------------------------------------------------

    /**
     * A PropertyEditor may chose to make available a full custom Component
     * that edits its property value.  It is the responsibility of the
     * PropertyEditor to hook itself up to its editor Component itself and
     * to report property value changes by firing a PropertyChange event.
     * <P>
     * The higher-level code that calls getCustomEditor may either embed
     * the Component in some larger property sheet, or it may put it in
     * its own individual dialog, or ...
     *
     * @return A java.awt.Component that will allow a human to directly
     *      edit the current property value.  May be null if this is
     *      not supported.
     */

    public java.awt.Component getCustomEditor() {
        return null;
    }

    /**
     * Determines whether the propertyEditor can provide a custom editor.
     *
     * @return  True if the propertyEditor can provide a custom editor.
     */
    public boolean supportsCustomEditor() {
        return false;
    }

    //----------------------------------------------------------------------

    /**
     * Adds a listener for the value change.
     * When the property editor changes its value
     * it should fire a {@link PropertyChangeEvent}
     * on all registered {@link PropertyChangeListener}s,
     * specifying the {@code null} value for the property name.
     * If the source property is set,
     * it should be used as the source of the event.
     * <p>
     * The same listener object may be added more than once,
     * and will be called as many times as it is added.
     * If {@code listener} is {@code null},
     * no exception is thrown and no action is taken.
     *
     * @param listener  the {@link PropertyChangeListener} to add
     */
    public synchronized void addPropertyChangeListener(
                                PropertyChangeListener listener) {
        if (listeners == null) {
            listeners = new java.util.Vector<>();
        }
        listeners.addElement(listener);
    }

    /**
     * Removes a listener for the value change.
     * <p>
     * If the same listener was added more than once,
     * it will be notified one less time after being removed.
     * If {@code listener} is {@code null}, or was never added,
     * no exception is thrown and no action is taken.
     *
     * @param listener  the {@link PropertyChangeListener} to remove
     */
    public synchronized void removePropertyChangeListener(
                                PropertyChangeListener listener) {
        if (listeners == null) {
            return;
        }
        listeners.removeElement(listener);
    }

    /**
     * Report that we have been modified to any interested listeners.
     */
    public void firePropertyChange() {
        java.util.Vector<PropertyChangeListener> targets;
        synchronized (this) {
            if (listeners == null) {
                return;
            }
            targets = unsafeClone(listeners);
        }
        // Tell our listeners that "everything" has changed.
        PropertyChangeEvent evt = new PropertyChangeEvent(source, null, null, null);

        for (int i = 0; i < targets.size(); i++) {
            PropertyChangeListener target = targets.elementAt(i);
            target.propertyChange(evt);
        }
    }

    @SuppressWarnings("unchecked")
    private <T> java.util.Vector<T> unsafeClone(java.util.Vector<T> v) {
        return (java.util.Vector<T>)v.clone();
    }

    //----------------------------------------------------------------------

    private Object value;
    private Object source;
    private java.util.Vector<PropertyChangeListener> listeners;
}
```