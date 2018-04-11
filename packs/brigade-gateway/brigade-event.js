
const k8s = require("@kubernetes/client-node");
const {Buffer} = require("buffer");
const ulid = require("ulid");

const kube = k8s.Config.defaultClient();

/**
 * Event describes an event to be sent to Brigade.
 * 
 * Events are created as Kubernetes secrets with a specific set of labels.
 * The Brigade controller watches for these events, and creates new
 * worker instances to handle them.
 * 
 * Event names are conventional. You can declare your own event name
 * here, and then your `brigade.js` file can handle it by declareing
 * `events.on("your_event_name"...)`
 * 
 * @param string ns
 *   The Kubernetes namespace.
 */
exports.Event = function(ns) {
    this.namespace = ns;
    /**
     * The commit SHA. If left empty, the tip of commit_ref will
     * be used instead.
     */
    this.commit_id = "";
    /**
     * The commit ref. Typically "master" or "refs/heads/manster"
     * is what you want. "refs/tags/XXX" can be used for a tag.
     */
    this.commit_ref = "refs/heads/master";
    /**
     * The name of the event provider (e.g. this gateway)
     */
    this.event_provider = "brigade-gw-pack";
    /**
     * A script to override the one in VCS.
     * If this is empty, the brigade.js in VCS will be used.
     */
    this.script = "";
    this.log_level = "";

    /**
     * The build ID. If this is blank (the suggested value) when `create()`
     * is called, a ULID will be generated and stored on this field.
     */
    this.build_id = "";

    /**
     * Create this event inside of Kubernetes.
     *
     * @param string hook
     *   The event name (e.g. exec)
     * @param string project
     *   The project ID, of the form 'brigade-XXXXXXXX...'
     * @param string payload
     *   The payload that should be sent. Empty is okay.
     */
    this.create = function(hook, project, payload) {
        // This is a guard to prevent us from creating
        // an event for a project that does not exist.
        return kube.readNamespacedSecret(project, this.namespace).then( () => {
            if (!this.build_id) {
              this.build_id = ulid.ulid().toLowerCase()
            }
            let buildName = `brigade-${this.build_id}`
            let secret = new k8s.V1Secret()
            secret.type = "brigade.sh/build"
            secret.metadata = {
                name: buildName,
                labels: {
                    component: "build",
                    heritage: "brigade",
                    build: this.build_id,
                    project: project
                }
            }
            secret.data = {
                // TODO: Do we let this info be passed in?
                commit_id: b64enc(this.commit_id),
                commit_ref: b64enc(this.commit_ref),
                build_id: b64enc(this.build_id),
                build_name: b64enc(buildName),
                event_provider: b64enc(this.event_provider),
                event_type: b64enc(hook),
                project_id: b64enc(project),
                payload: b64enc(payload)
            }
            if (this.script) {
                secret.data.script = base64enc(this.script);
            }
            if (this.log_level) {
                secret.data.log_level = base64enc(this.script);
            }
            return kube.createNamespacedSecret(this.namespace, secret);
        }).catch(() => {
            return Promise.reject(`project ${project} could not be loaded`);
        })
    }
}

function b64enc(original) {
    return Buffer.from(original).toString("base64");
}
