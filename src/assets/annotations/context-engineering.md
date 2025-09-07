### Context engineering over Multimodal RAG

This diagram illustrates how *context components* are assembled and analysed in order to guide multimodal retrieval and generation.  
Instead of thinking about them as abstract boxes, you can imagine each as a type of 'signal' or “ingredient” that feeds into the overall reasoning process.

---

### Context components (blue pills)

- **cinstr → Context instructions**  
  Task-specific steering added directly into the prompt.  
  For example: *'Summarise in 3 bullet points”* or *“Answer as a legal expert'*.  

- **cknow → Context knowledge**  
  External knowledge sources pulled in at query time to provide factual grounding.  
  This can include domain documents, APIs, or databases.  

- **ctools → Context tools**  
  Specialised functions or models that the system can call when needed.  
  Think of calculators, search APIs, or a code interpreter.  

- **cmem → Context memory**  
  Past interactions or history carried forward.  
  This might include conversation memory, embeddings-based recall, or long-term logs.  

- **cstate → Context state**  
  Signals about the current system or user situation.  
  For instance: a user profile, the active workflow step, or the state of the UI.  

- **cquery → Context query**  
  The user’s original question after being enriched with the above.  
  It becomes the *fully informed query* that drives the retrieval process.  

---

### Narrative

Context engineering begins with a **strategy** that defines what 'context' should mean for the task at hand.  
That strategy is broken down into the **components above**, each bringing its own type of signal.  

These pieces are then **assembled and optimised** into a single representation of context.  
This enriched query flows into the **RAG query analyser**, which coordinates how retrieval happens.  

From there, the system can reach into **vector databases**, **graph structures**, or **other modalities** depending on what the query demands.  
Finally, the results are combined in a **fusion step** and shaped into the **generated output**.  

---

In short: context engineering takes many small signals — instructions, knowledge, tools, memory, state, and the query itself — and weaves them together into a stronger foundation for retrieval and generation.