component persistent="true" extends="DeNotes.model.BaseEntity" table="tag"{
	
	property name="id" column="tagid" fieldtype="id" generator="identity" setter="false";
	property name="tagname";
	property name="userid";
	property name="notetags" linktable="notetags" cfc="NoteTags" type="array" fieldtype="many-to-many" singularname="Notetag" fkcolumn="tagid" inversejoincolumn="noteid";
	
	public Tag function init(){	
		return this;
	}
}