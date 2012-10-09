component persistent="true" extends="DeNotes.model.BaseEntity" table="notetags" accessors="true"{
	
	property name="id" fieldtype="id" generator="identity" setter="false";
	property name="tagid";
	property name="noteid";
	property name="notes" cfc="Note" fieldtype="one-to-many" fkcolumn="noteid" insert="false" update="false" inverse="true";
	property name="tag" cfc="Tag" fieldtype="one-to-many" fkcolumn="tagid" insert="false" update="false" inverse="true"; 
	
	public NoteTags function init(){	
		return this;
	}
}
