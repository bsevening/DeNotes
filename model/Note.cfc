component persistent="true" extends="DeNotes.model.BaseEntity" table="note"{
	
	property name="id" fieldtype="id" column="noteid" generator="identity" setter="false";
	property name="title" default="" elementtype="string";
	property name="note" default="" elementtype="string";
	property name="userid" default="0" elementtype="string";
	property name="notetags" linktable="notetags" cfc="NoteTags" type="array" singularname="Notetag" fieldtype="many-to-many" fkcolumn="noteid" inversejoincolumn="tagid";   
	
	public Note function init(){	
		return this;
	}
}
