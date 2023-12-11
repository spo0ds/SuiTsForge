module registration::school {
    use std::string;
    use sui::object::{Self,UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::dynamic_object_field as ofield;
    use std::vector;
    use sui::clock::{Self, Clock};


    struct Location has store,copy,drop {
        type: string::String, 
        longitude: string::String,
        latitude: string::String,
    }

    struct TimeStamp has copy,store,drop {
        created_at: u64,
        updated_at: u64,
    }

    struct School has key, store {
        id: UID,
        name: string::String,
        contact: string::String,
        images: vector<string::String>,
        description: string::String,
        location: Location,
        timestamp: TimeStamp,
    }

    struct School_Record has key {
        id: UID,
        school_added_count: u64,
    }

    struct Cap has key{
        id: UID, 
    }

    fun init(ctx:&mut TxContext) {
        let id = object::new(ctx);
        transfer::share_object(School_Record {
            id,
            school_added_count: 0u64,
        });
        transfer::transfer(Cap{
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }


    public entry fun addSchool(
        name: string::String,
        contact: string::String,
        images: vector<string::String>,
        description: string::String,
        type: string::String,
        longitude: string::String,
        latitude: string::String,
        school_object: &mut School_Record,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let location = Location {
            type: type,
            longitude: longitude,
            latitude: latitude,
        };

        let timestamp = TimeStamp {
            created_at: clock::timestamp_ms(clock),
            updated_at: clock::timestamp_ms(clock),
        };

        let school_reg = School {
            id: object::new(ctx),
            name,
            contact,
            images,
            description,
            location,
            timestamp,
        };
        // Adding school to record 
        let school_id = object::id(&school_reg);
        ofield::add(&mut school_object.id, school_id, school_reg);
        school_object.school_added_count = school_object.school_added_count + 1;
        event::emit(Location { 
            type:type,
            longitude: longitude,
            latitude: latitude,
        });
    }


    // ===== Public view functions =====

    public fun view_name(parent: &School_Record, child_id: ID): string::String {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.name
    }

    public fun view_contact(parent: &School_Record, child_id: ID): string::String {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.contact
    }

    public fun view_images(parent: &School_Record, child_id: ID): vector<string::String> {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.images
    }

    public fun view_description(parent: &School_Record, child_id: ID): string::String {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.description
    }

    public fun view_coordinates(parent: &School_Record, child_id: ID): Location {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.location
    }

    public fun view_timestamp(parent: &School_Record, child_id: ID): TimeStamp {
        let obj = ofield::borrow<ID, School>(&parent.id, child_id);
        obj.timestamp
    }

    public fun view_school(parent: &School_Record, child_id: ID): &School {
        ofield::borrow<ID, School>(&parent.id, child_id)
    }

    // ===== Update functions =====

    fun mutate_name(child: &mut School, name:string::String,clock: &Clock,) {
        child.name = name;
        child.timestamp.updated_at = clock::timestamp_ms(clock);
    }

    public entry fun update_name(_cap:&Cap, parent: &mut School_Record, child_id: ID, name:string::String, clock: &Clock,) {
        mutate_name(ofield::borrow_mut<ID, School>(
            &mut parent.id,
            child_id,
        ), 
        name,
        clock
        );
    }

    fun mutate_contact(child: &mut School, contact:string::String, clock: &Clock) {
        child.contact = contact;
        child.timestamp.updated_at = clock::timestamp_ms(clock);
    }

    public entry fun update_contact(_cap:&Cap, parent: &mut School_Record, child_id: ID, contact:string::String, clock: &Clock) {
        mutate_contact(ofield::borrow_mut<ID, School>(
            &mut parent.id,
            child_id,
        ), 
        contact,
        clock
        );
    }

    fun mutate_images(child: &mut School, images: vector<string::String>, clock: &Clock) {
        child.images = vector::empty<string::String>(); 
        vector::append(&mut child.images, images);
        child.timestamp.updated_at = clock::timestamp_ms(clock);
    }


    public entry fun update_images(_cap:&Cap, parent: &mut School_Record, child_id: ID, images:vector<string::String>,clock: &Clock) {
        mutate_images(ofield::borrow_mut<ID, School>(
            &mut parent.id,
            child_id,
        ), 
        images,
        clock
        );
    }

    fun mutate_description(child: &mut School, description:string::String, clock: &Clock) {
        child.description = description;
        child.timestamp.updated_at = clock::timestamp_ms(clock);
    }

    public entry fun update_description(_cap:&Cap, parent: &mut School_Record, child_id: ID, description:string::String, clock: &Clock) {
        mutate_description(ofield::borrow_mut<ID, School>(
            &mut parent.id,
            child_id,
        ), 
        description,
        clock
        );
    }

    fun mutate_location(child: &mut School, type:string::String,longitude:string::String, latitude:string::String, clock: &Clock,) {
        child.location.type = type;
        child.location.latitude = latitude;
        child.location.longitude = longitude;
        child.timestamp.updated_at = clock::timestamp_ms(clock);
    }

    public entry fun update_location(_cap:&Cap, parent: &mut School_Record, child_id: ID, type:string::String, longitude:string::String, latitude:string::String, clock: &Clock,) {
        mutate_location(ofield::borrow_mut<ID, School>(
            &mut parent.id,
            child_id,
        ), 
            type,
            longitude,
            latitude,
            clock
        );
    }

    // ===== Delete a school object =====
    public entry fun delete_school_object(_:&Cap, parent: &mut School_Record, child_id: ID) {
        let School { id, name:_, contact:_,images:_,description:_,location:_,timestamp:_} = ofield::remove<ID, School>(
            &mut parent.id,
            child_id,
        );
        object::delete(id);
    }
}
