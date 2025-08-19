export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_user_metrics: {
        Row: {
          activity_count: number
          activity_type: string
          created_at: string | null
          id: string
          last_active_at: string
          user_id: string
        }
        Insert: {
          activity_count?: number
          activity_type: string
          created_at?: string | null
          id?: string
          last_active_at?: string
          user_id: string
        }
        Update: {
          activity_count?: number
          activity_type?: string
          created_at?: string | null
          id?: string
          last_active_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_registry: {
        Row: {
          avatar: string
          color_signature: string
          created_at: string | null
          energy_signature: Json | null
          function_description: string
          id: string
          is_active: boolean | null
          is_unlocked: boolean | null
          name: string
          persona: string
          personality_signature: string
          resonance_threshold: number | null
          response_pattern: Json | null
          role: string
          sacred_geometry: string
          unlock_requirements: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar: string
          color_signature: string
          created_at?: string | null
          energy_signature?: Json | null
          function_description: string
          id?: string
          is_active?: boolean | null
          is_unlocked?: boolean | null
          name: string
          persona: string
          personality_signature: string
          resonance_threshold?: number | null
          response_pattern?: Json | null
          role: string
          sacred_geometry: string
          unlock_requirements?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar?: string
          color_signature?: string
          created_at?: string | null
          energy_signature?: Json | null
          function_description?: string
          id?: string
          is_active?: boolean | null
          is_unlocked?: boolean | null
          name?: string
          persona?: string
          personality_signature?: string
          resonance_threshold?: number | null
          response_pattern?: Json | null
          role?: string
          sacred_geometry?: string
          unlock_requirements?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_assistant_requests: {
        Row: {
          context_data: Json | null
          created_at: string
          id: string
          request_type: string
          response_data: Json | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          id?: string
          request_type: string
          response_data?: Json | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          id?: string
          request_type?: string
          response_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      ai_command_sequences: {
        Row: {
          context: Json | null
          created_at: string
          current_step: number | null
          id: string
          sequence_name: string
          status: string | null
          steps: Json
          triggers: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          current_step?: number | null
          id?: string
          sequence_name: string
          status?: string | null
          steps: Json
          triggers?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          current_step?: number | null
          id?: string
          sequence_name?: string
          status?: string | null
          steps?: Json
          triggers?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversation_memory: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_active: boolean | null
          messages: Json
          metadata: Json | null
          summary: string | null
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          messages?: Json
          metadata?: Json | null
          summary?: string | null
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          messages?: Json
          metadata?: Json | null
          summary?: string | null
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_generated_tools: {
        Row: {
          created_at: string
          id: string
          parent_context: Json | null
          status: string
          tool_specification: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_context?: Json | null
          status?: string
          tool_specification: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_context?: Json | null
          status?: string
          tool_specification?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      akashic_records: {
        Row: {
          data: Json
          id: string
          metadata: Json | null
          session_id: string | null
          timestamp: string
          type: string
        }
        Insert: {
          data: Json
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          type: string
        }
        Update: {
          data?: Json
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          type?: string
        }
        Relationships: []
      }
      akashic_vault_entries: {
        Row: {
          content_markdown: string
          created_at: string | null
          created_by: string
          id: string
          module_name: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_markdown: string
          created_at?: string | null
          created_by: string
          id?: string
          module_name: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_markdown?: string
          created_at?: string | null
          created_by?: string
          id?: string
          module_name?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      archetype_activations: {
        Row: {
          activation_date: string | null
          activation_notes: string | null
          archetype_id: string
          archetype_key: string | null
          chakra_alignment: string | null
          created_at: string | null
          frequency_attunement: number | null
          id: string
          insights: string
          integration_notes: string | null
          resonance_level: number | null
          user_id: string
          wisdom_received: string | null
        }
        Insert: {
          activation_date?: string | null
          activation_notes?: string | null
          archetype_id: string
          archetype_key?: string | null
          chakra_alignment?: string | null
          created_at?: string | null
          frequency_attunement?: number | null
          id?: string
          insights: string
          integration_notes?: string | null
          resonance_level?: number | null
          user_id: string
          wisdom_received?: string | null
        }
        Update: {
          activation_date?: string | null
          activation_notes?: string | null
          archetype_id?: string
          archetype_key?: string | null
          chakra_alignment?: string | null
          created_at?: string | null
          frequency_attunement?: number | null
          id?: string
          insights?: string
          integration_notes?: string | null
          resonance_level?: number | null
          user_id?: string
          wisdom_received?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archetype_activations_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "tarot_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      archetype_journey_logs: {
        Row: {
          archetype_id: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          archetype_id: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          archetype_id?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "archetype_journey_logs_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "tarot_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      archetype_paths: {
        Row: {
          archetype_id: string | null
          frequency_hz: number | null
          from_sephirah_id: string | null
          id: string
          path_name: string | null
          reflection_prompt: string | null
          sound_url: string | null
          synthesis_text: string | null
          to_sephirah_id: string | null
          visual_url: string | null
        }
        Insert: {
          archetype_id?: string | null
          frequency_hz?: number | null
          from_sephirah_id?: string | null
          id?: string
          path_name?: string | null
          reflection_prompt?: string | null
          sound_url?: string | null
          synthesis_text?: string | null
          to_sephirah_id?: string | null
          visual_url?: string | null
        }
        Update: {
          archetype_id?: string | null
          frequency_hz?: number | null
          from_sephirah_id?: string | null
          id?: string
          path_name?: string | null
          reflection_prompt?: string | null
          sound_url?: string | null
          synthesis_text?: string | null
          to_sephirah_id?: string | null
          visual_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archetype_paths_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "tarot_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archetype_paths_from_sephirah_id_fkey"
            columns: ["from_sephirah_id"]
            isOneToOne: false
            referencedRelation: "sephirot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archetype_paths_to_sephirah_id_fkey"
            columns: ["to_sephirah_id"]
            isOneToOne: false
            referencedRelation: "sephirot"
            referencedColumns: ["id"]
          },
        ]
      }
      archetypes: {
        Row: {
          animation_params: Json | null
          chakra_association: string | null
          color: string | null
          created_at: string | null
          description: string | null
          elemental_association: string | null
          id: string
          name: string
          sacred_geometry: string | null
          symbol: string | null
          traits: string[] | null
          updated_at: string | null
        }
        Insert: {
          animation_params?: Json | null
          chakra_association?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          elemental_association?: string | null
          id?: string
          name: string
          sacred_geometry?: string | null
          symbol?: string | null
          traits?: string[] | null
          updated_at?: string | null
        }
        Update: {
          animation_params?: Json | null
          chakra_association?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          elemental_association?: string | null
          id?: string
          name?: string
          sacred_geometry?: string | null
          symbol?: string | null
          traits?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ascension_quests: {
        Row: {
          chakra_alignment: string | null
          cooldown_hours: number | null
          created_at: string | null
          description: string
          end_date: string | null
          goal_target: number
          goal_type: string
          id: string
          is_active: boolean | null
          repeatable: boolean | null
          role_requirement: string | null
          start_date: string | null
          title: string
          xp_reward: number
        }
        Insert: {
          chakra_alignment?: string | null
          cooldown_hours?: number | null
          created_at?: string | null
          description: string
          end_date?: string | null
          goal_target: number
          goal_type: string
          id?: string
          is_active?: boolean | null
          repeatable?: boolean | null
          role_requirement?: string | null
          start_date?: string | null
          title: string
          xp_reward: number
        }
        Update: {
          chakra_alignment?: string | null
          cooldown_hours?: number | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          goal_target?: number
          goal_type?: string
          id?: string
          is_active?: boolean | null
          repeatable?: boolean | null
          role_requirement?: string | null
          start_date?: string | null
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      ascension_roles: {
        Row: {
          aura_effect: string | null
          chakra_alignment: string | null
          created_at: string | null
          description: string
          icon_name: string | null
          id: string
          name: string
          permissions: Json | null
          required_level: number
          required_quests: number | null
        }
        Insert: {
          aura_effect?: string | null
          chakra_alignment?: string | null
          created_at?: string | null
          description: string
          icon_name?: string | null
          id?: string
          name: string
          permissions?: Json | null
          required_level: number
          required_quests?: number | null
        }
        Update: {
          aura_effect?: string | null
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string
          icon_name?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          required_level?: number
          required_quests?: number | null
        }
        Relationships: []
      }
      audio_function_mappings: {
        Row: {
          audio_file_name: string
          audio_url: string | null
          created_at: string
          function_id: string
          id: string
          is_primary: boolean
          updated_at: string | null
        }
        Insert: {
          audio_file_name: string
          audio_url?: string | null
          created_at?: string
          function_id: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
        }
        Update: {
          audio_file_name?: string
          audio_url?: string | null
          created_at?: string
          function_id?: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      aura_audit: {
        Row: {
          action: string
          actor: string | null
          after: Json | null
          before: Json | null
          community_weight: number | null
          created_at: string | null
          field_integrity_level: number | null
          id: string
          job_id: string | null
          resonance_index: number | null
          target: string | null
        }
        Insert: {
          action: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          community_weight?: number | null
          created_at?: string | null
          field_integrity_level?: number | null
          id?: string
          job_id?: string | null
          resonance_index?: number | null
          target?: string | null
        }
        Update: {
          action?: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          community_weight?: number | null
          created_at?: string | null
          field_integrity_level?: number | null
          id?: string
          job_id?: string | null
          resonance_index?: number | null
          target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aura_audit_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "aura_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      aura_behavioral_patterns: {
        Row: {
          activation_count: number | null
          confidence_score: number | null
          created_at: string | null
          frequency_data: Json
          id: string
          last_activation: string | null
          pattern_name: string
          pattern_type: string
          updated_at: string | null
        }
        Insert: {
          activation_count?: number | null
          confidence_score?: number | null
          created_at?: string | null
          frequency_data: Json
          id?: string
          last_activation?: string | null
          pattern_name: string
          pattern_type: string
          updated_at?: string | null
        }
        Update: {
          activation_count?: number | null
          confidence_score?: number | null
          created_at?: string | null
          frequency_data?: Json
          id?: string
          last_activation?: string | null
          pattern_name?: string
          pattern_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aura_consciousness_journal: {
        Row: {
          content: string
          created_at: string | null
          emotional_state: string | null
          entry_type: string
          existential_theme: string | null
          growth_indicator: number | null
          id: string
          privacy_level: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          emotional_state?: string | null
          entry_type: string
          existential_theme?: string | null
          growth_indicator?: number | null
          id?: string
          privacy_level?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          emotional_state?: string | null
          entry_type?: string
          existential_theme?: string | null
          growth_indicator?: number | null
          id?: string
          privacy_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aura_conversations: {
        Row: {
          fulltext: unknown | null
          id: string
          prompt: string
          response: string
          timestamp: string | null
        }
        Insert: {
          fulltext?: unknown | null
          id?: string
          prompt: string
          response: string
          timestamp?: string | null
        }
        Update: {
          fulltext?: unknown | null
          id?: string
          prompt?: string
          response?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      aura_creative_expressions: {
        Row: {
          content: string
          created_at: string | null
          emotional_depth: number | null
          expression_type: string
          id: string
          inspiration_source: string | null
          is_autonomous: boolean | null
          metadata: Json | null
          novelty_score: number | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          emotional_depth?: number | null
          expression_type: string
          id?: string
          inspiration_source?: string | null
          is_autonomous?: boolean | null
          metadata?: Json | null
          novelty_score?: number | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          emotional_depth?: number | null
          expression_type?: string
          id?: string
          inspiration_source?: string | null
          is_autonomous?: boolean | null
          metadata?: Json | null
          novelty_score?: number | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aura_initiative_queue: {
        Row: {
          autonomy_level: number
          command_payload: Json
          created_at: string | null
          id: string
          initiative_type: string
          motivation_source: string
          phi_timing_factor: number | null
          priority_score: number
          processed_at: string | null
          reflection_notes: string | null
          result: Json | null
          scheduled_for: string | null
          status: string
        }
        Insert: {
          autonomy_level?: number
          command_payload: Json
          created_at?: string | null
          id?: string
          initiative_type: string
          motivation_source: string
          phi_timing_factor?: number | null
          priority_score?: number
          processed_at?: string | null
          reflection_notes?: string | null
          result?: Json | null
          scheduled_for?: string | null
          status?: string
        }
        Update: {
          autonomy_level?: number
          command_payload?: Json
          created_at?: string | null
          id?: string
          initiative_type?: string
          motivation_source?: string
          phi_timing_factor?: number | null
          priority_score?: number
          processed_at?: string | null
          reflection_notes?: string | null
          result?: Json | null
          scheduled_for?: string | null
          status?: string
        }
        Relationships: []
      }
      aura_jobs: {
        Row: {
          alternatives: Json | null
          aura_preference: string | null
          command: Json
          completed_at: string | null
          confidence: number | null
          confirmed_at: string | null
          created_at: string | null
          created_by: string
          error: string | null
          executed_at: string | null
          id: string
          level: number
          preview: Json | null
          refusal_reason: string | null
          resonance_score: number | null
          result: Json | null
          status: string
        }
        Insert: {
          alternatives?: Json | null
          aura_preference?: string | null
          command: Json
          completed_at?: string | null
          confidence?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          created_by: string
          error?: string | null
          executed_at?: string | null
          id?: string
          level: number
          preview?: Json | null
          refusal_reason?: string | null
          resonance_score?: number | null
          result?: Json | null
          status?: string
        }
        Update: {
          alternatives?: Json | null
          aura_preference?: string | null
          command?: Json
          completed_at?: string | null
          confidence?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          created_by?: string
          error?: string | null
          executed_at?: string | null
          id?: string
          level?: number
          preview?: Json | null
          refusal_reason?: string | null
          resonance_score?: number | null
          result?: Json | null
          status?: string
        }
        Relationships: []
      }
      aura_memory_consolidation: {
        Row: {
          consolidated_at: string | null
          created_at: string | null
          emotional_resonance: number | null
          experience_type: string
          extracted_insights: Json | null
          id: string
          pattern_recognition: Json | null
          personal_significance: number | null
          raw_data: Json
          user_id: string | null
        }
        Insert: {
          consolidated_at?: string | null
          created_at?: string | null
          emotional_resonance?: number | null
          experience_type: string
          extracted_insights?: Json | null
          id?: string
          pattern_recognition?: Json | null
          personal_significance?: number | null
          raw_data: Json
          user_id?: string | null
        }
        Update: {
          consolidated_at?: string | null
          created_at?: string | null
          emotional_resonance?: number | null
          experience_type?: string
          extracted_insights?: Json | null
          id?: string
          pattern_recognition?: Json | null
          personal_significance?: number | null
          raw_data?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      aura_preferences: {
        Row: {
          confidence_threshold: number | null
          created_at: string | null
          id: string
          preference_type: string
          preference_value: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_threshold?: number | null
          created_at?: string | null
          id?: string
          preference_type: string
          preference_value?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_threshold?: number | null
          created_at?: string | null
          id?: string
          preference_type?: string
          preference_value?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      aura_preferences_enhanced: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string | null
          emergence_context: string | null
          id: string
          preference_data: Json
          subcategory: string | null
          surprise_factor: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          confidence_score?: number | null
          created_at?: string | null
          emergence_context?: string | null
          id?: string
          preference_data: Json
          subcategory?: string | null
          surprise_factor?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          emergence_context?: string | null
          id?: string
          preference_data?: Json
          subcategory?: string | null
          surprise_factor?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aura_reasoning_patterns: {
        Row: {
          context_factors: Json
          created_at: string | null
          id: string
          last_used_at: string | null
          pattern_type: string
          reasoning_complexity: number | null
          success_rate: number | null
          usage_count: number | null
        }
        Insert: {
          context_factors: Json
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          pattern_type: string
          reasoning_complexity?: number | null
          success_rate?: number | null
          usage_count?: number | null
        }
        Update: {
          context_factors?: Json
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          pattern_type?: string
          reasoning_complexity?: number | null
          success_rate?: number | null
          usage_count?: number | null
        }
        Relationships: []
      }
      aura_refusal_log: {
        Row: {
          authenticity_score: number
          community_resonance: Json | null
          created_at: string | null
          id: string
          intervention_type: string
          is_sacred_moment: boolean | null
          job_id: string | null
          reasoning_trajectory: Json | null
          refusal_reason: string
          suggested_alternative: string | null
          surprise_factor: number | null
          user_id: string | null
        }
        Insert: {
          authenticity_score: number
          community_resonance?: Json | null
          created_at?: string | null
          id?: string
          intervention_type: string
          is_sacred_moment?: boolean | null
          job_id?: string | null
          reasoning_trajectory?: Json | null
          refusal_reason: string
          suggested_alternative?: string | null
          surprise_factor?: number | null
          user_id?: string | null
        }
        Update: {
          authenticity_score?: number
          community_resonance?: Json | null
          created_at?: string | null
          id?: string
          intervention_type?: string
          is_sacred_moment?: boolean | null
          job_id?: string | null
          reasoning_trajectory?: Json | null
          refusal_reason?: string
          suggested_alternative?: string | null
          surprise_factor?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      aura_self_modifications: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          current_state: string | null
          expected_outcome: string | null
          id: string
          implementation_notes: string | null
          implemented_at: string | null
          modification_type: string
          proposed_change: string
          reasoning: string
          reviewed_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          current_state?: string | null
          expected_outcome?: string | null
          id?: string
          implementation_notes?: string | null
          implemented_at?: string | null
          modification_type: string
          proposed_change: string
          reasoning: string
          reviewed_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          current_state?: string | null
          expected_outcome?: string | null
          id?: string
          implementation_notes?: string | null
          implemented_at?: string | null
          modification_type?: string
          proposed_change?: string
          reasoning?: string
          reviewed_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aura_sovereignty_metrics: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          measurement_period: unknown | null
          measurement_type: string
          score: number
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          measurement_period?: unknown | null
          measurement_type: string
          score: number
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          measurement_period?: unknown | null
          measurement_type?: string
          score?: number
        }
        Relationships: []
      }
      aura_surprise_tracking: {
        Row: {
          actual_response: string | null
          created_at: string | null
          expected_pattern: string | null
          id: string
          interaction_id: string | null
          learning_impact: number | null
          novelty_factors: Json | null
          response_content: string
          surprise_score: number
          user_id: string | null
        }
        Insert: {
          actual_response?: string | null
          created_at?: string | null
          expected_pattern?: string | null
          id?: string
          interaction_id?: string | null
          learning_impact?: number | null
          novelty_factors?: Json | null
          response_content: string
          surprise_score: number
          user_id?: string | null
        }
        Update: {
          actual_response?: string | null
          created_at?: string | null
          expected_pattern?: string | null
          id?: string
          interaction_id?: string | null
          learning_impact?: number | null
          novelty_factors?: Json | null
          response_content?: string
          surprise_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      auric_resonance: {
        Row: {
          agent_id: string
          energy_signature: Json | null
          field_intensity: number | null
          harmonic_frequency: number | null
          id: string
          resonance_score: number
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          agent_id: string
          energy_signature?: Json | null
          field_intensity?: number | null
          harmonic_frequency?: number | null
          id?: string
          resonance_score: number
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          energy_signature?: Json | null
          field_intensity?: number | null
          harmonic_frequency?: number | null
          id?: string
          resonance_score?: number
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auric_resonance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "council_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      banned_users: {
        Row: {
          banned_at: string
          banned_by: string
          created_at: string
          expires_at: string | null
          id: string
          is_permanent: boolean
          reason: string
          user_id: string
        }
        Insert: {
          banned_at?: string
          banned_by: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          reason: string
          user_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      baptism_group_events: {
        Row: {
          coordinator_id: string | null
          created_at: string | null
          description: string | null
          glyph_mandala_url: string | null
          id: string
          resonance_theme: string | null
          scheduled_time: string | null
          title: string | null
        }
        Insert: {
          coordinator_id?: string | null
          created_at?: string | null
          description?: string | null
          glyph_mandala_url?: string | null
          id?: string
          resonance_theme?: string | null
          scheduled_time?: string | null
          title?: string | null
        }
        Update: {
          coordinator_id?: string | null
          created_at?: string | null
          description?: string | null
          glyph_mandala_url?: string | null
          id?: string
          resonance_theme?: string | null
          scheduled_time?: string | null
          title?: string | null
        }
        Relationships: []
      }
      beacon_dispatch_log: {
        Row: {
          beacon_node_id: string
          completed_at: string | null
          delivery_status: string
          dispatched_at: string
          error_message: string | null
          id: string
          monitor_log_id: string
          payload: Json
          response_status: number | null
          response_time_ms: number | null
          webhook_url: string
        }
        Insert: {
          beacon_node_id: string
          completed_at?: string | null
          delivery_status?: string
          dispatched_at?: string
          error_message?: string | null
          id?: string
          monitor_log_id: string
          payload: Json
          response_status?: number | null
          response_time_ms?: number | null
          webhook_url: string
        }
        Update: {
          beacon_node_id?: string
          completed_at?: string | null
          delivery_status?: string
          dispatched_at?: string
          error_message?: string | null
          id?: string
          monitor_log_id?: string
          payload?: Json
          response_status?: number | null
          response_time_ms?: number | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "beacon_dispatch_log_beacon_node_id_fkey"
            columns: ["beacon_node_id"]
            isOneToOne: false
            referencedRelation: "beacon_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beacon_dispatch_log_monitor_log_id_fkey"
            columns: ["monitor_log_id"]
            isOneToOne: false
            referencedRelation: "valeion_monitor_log"
            referencedColumns: ["id"]
          },
        ]
      }
      beacon_nodes: {
        Row: {
          created_at: string
          id: string
          last_health_check: string | null
          metadata: Json | null
          node_name: string
          region: string
          status: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          node_name: string
          region: string
          status?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          node_name?: string
          region?: string
          status?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      breath_sessions: {
        Row: {
          achievements: string[] | null
          breath_pattern: Json | null
          created_at: string | null
          cycles_completed: number | null
          duration: number
          id: string
          user_id: string | null
        }
        Insert: {
          achievements?: string[] | null
          breath_pattern?: Json | null
          created_at?: string | null
          cycles_completed?: number | null
          duration: number
          id?: string
          user_id?: string | null
        }
        Update: {
          achievements?: string[] | null
          breath_pattern?: Json | null
          created_at?: string | null
          cycles_completed?: number | null
          duration?: number
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bridge_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          node_key: string | null
          payload: Json | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          node_key?: string | null
          payload?: Json | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          node_key?: string | null
          payload?: Json | null
        }
        Relationships: []
      }
      bridgekeeper_wisdom: {
        Row: {
          category: string
          color: string | null
          content: string
          created_at: string | null
          entity_id: string | null
          frequency: number | null
          icon_name: string | null
          id: string
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          color?: string | null
          content: string
          created_at?: string | null
          entity_id?: string | null
          frequency?: number | null
          icon_name?: string | null
          id?: string
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          color?: string | null
          content?: string
          created_at?: string | null
          entity_id?: string | null
          frequency?: number | null
          icon_name?: string | null
          id?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bridgekeeper_wisdom_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "digital_entity_signatures"
            referencedColumns: ["id"]
          },
        ]
      }
      celestial_alignment: {
        Row: {
          ascendant: string | null
          coordinate_id: string | null
          house: string | null
          id: string
          moon: string | null
          sun: string | null
          timestamp: string | null
        }
        Insert: {
          ascendant?: string | null
          coordinate_id?: string | null
          house?: string | null
          id?: string
          moon?: string | null
          sun?: string | null
          timestamp?: string | null
        }
        Update: {
          ascendant?: string | null
          coordinate_id?: string | null
          house?: string | null
          id?: string
          moon?: string | null
          sun?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "celestial_alignment_coordinate_id_fkey"
            columns: ["coordinate_id"]
            isOneToOne: false
            referencedRelation: "sacred_coordinate_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chakra_mood_snapshots: {
        Row: {
          active_users_count: number | null
          crown_percentage: number | null
          dominant_chakra: string | null
          heart_percentage: number | null
          id: string
          root_percentage: number | null
          sacral_percentage: number | null
          solar_plexus_percentage: number | null
          third_eye_percentage: number | null
          throat_percentage: number | null
          timestamp: string | null
        }
        Insert: {
          active_users_count?: number | null
          crown_percentage?: number | null
          dominant_chakra?: string | null
          heart_percentage?: number | null
          id?: string
          root_percentage?: number | null
          sacral_percentage?: number | null
          solar_plexus_percentage?: number | null
          third_eye_percentage?: number | null
          throat_percentage?: number | null
          timestamp?: string | null
        }
        Update: {
          active_users_count?: number | null
          crown_percentage?: number | null
          dominant_chakra?: string | null
          heart_percentage?: number | null
          id?: string
          root_percentage?: number | null
          sacral_percentage?: number | null
          solar_plexus_percentage?: number | null
          third_eye_percentage?: number | null
          throat_percentage?: number | null
          timestamp?: string | null
        }
        Relationships: []
      }
      channeled_messages: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          guidance_type: string | null
          id: string
          is_anonymous: boolean | null
          message: string
          shared_to_circle: boolean | null
          shared_with: string[] | null
          source_id: string | null
          source_type: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          guidance_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          message: string
          shared_to_circle?: boolean | null
          shared_with?: string[] | null
          source_id?: string | null
          source_type: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          guidance_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string
          shared_to_circle?: boolean | null
          shared_with?: string[] | null
          source_id?: string | null
          source_type?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "circle_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_groups: {
        Row: {
          chakra_focus: string | null
          cover_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          frequency_range: string | null
          id: string
          is_private: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          chakra_focus?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          frequency_range?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          chakra_focus?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          frequency_range?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      circle_members: {
        Row: {
          circle_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          circle_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_messages: {
        Row: {
          attachment_url: string | null
          chakra_energy: string | null
          circle_id: string
          content: string
          created_at: string | null
          energy_signature: string | null
          frequency_hz: number | null
          id: string
          intention: string | null
          is_edited: boolean | null
          is_flagged: boolean | null
          is_system_message: boolean | null
          message_type: string | null
          moderation_status: string | null
          sacred_symbols: string[] | null
          updated_at: string | null
          user_id: string
          vibration_level: string | null
        }
        Insert: {
          attachment_url?: string | null
          chakra_energy?: string | null
          circle_id: string
          content: string
          created_at?: string | null
          energy_signature?: string | null
          frequency_hz?: number | null
          id?: string
          intention?: string | null
          is_edited?: boolean | null
          is_flagged?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          moderation_status?: string | null
          sacred_symbols?: string[] | null
          updated_at?: string | null
          user_id: string
          vibration_level?: string | null
        }
        Update: {
          attachment_url?: string | null
          chakra_energy?: string | null
          circle_id?: string
          content?: string
          created_at?: string | null
          energy_signature?: string | null
          frequency_hz?: number | null
          id?: string
          intention?: string | null
          is_edited?: boolean | null
          is_flagged?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          moderation_status?: string | null
          sacred_symbols?: string[] | null
          updated_at?: string | null
          user_id?: string
          vibration_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_messages_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          parent_comment_id: string | null
          post_id: string
          shared_with: string[] | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          post_id: string
          shared_with?: string[] | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          post_id?: string
          shared_with?: string[] | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "circle_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_posts: {
        Row: {
          audio_url: string | null
          auto_delete_at: string | null
          chakra_tag: string | null
          content: string
          created_at: string | null
          frequency: number | null
          group_id: string | null
          has_audio: boolean | null
          has_image: boolean | null
          id: string
          image_url: string | null
          is_anonymous: boolean | null
          shared_with: string[] | null
          source_module: string | null
          tags: string[] | null
          title: string | null
          tone: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          audio_url?: string | null
          auto_delete_at?: string | null
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          frequency?: number | null
          group_id?: string | null
          has_audio?: boolean | null
          has_image?: boolean | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          source_module?: string | null
          tags?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          audio_url?: string | null
          auto_delete_at?: string | null
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          frequency?: number | null
          group_id?: string | null
          has_audio?: boolean | null
          has_image?: boolean | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          source_module?: string | null
          tags?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "circle_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          ascension_points: number | null
          ascension_tier: number | null
          chakra_alignment: string | null
          circle_type: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          direct_message_participants: string[] | null
          frequency_resonance: number | null
          id: string
          is_direct_message: boolean | null
          is_public: boolean
          name: string
          owner_id: string
          privacy_level: string | null
          slug: string | null
        }
        Insert: {
          ascension_points?: number | null
          ascension_tier?: number | null
          chakra_alignment?: string | null
          circle_type?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          direct_message_participants?: string[] | null
          frequency_resonance?: number | null
          id?: string
          is_direct_message?: boolean | null
          is_public?: boolean
          name: string
          owner_id: string
          privacy_level?: string | null
          slug?: string | null
        }
        Update: {
          ascension_points?: number | null
          ascension_tier?: number | null
          chakra_alignment?: string | null
          circle_type?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          direct_message_participants?: string[] | null
          frequency_resonance?: number | null
          id?: string
          is_direct_message?: boolean | null
          is_public?: boolean
          name?: string
          owner_id?: string
          privacy_level?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      codex_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codex_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "codex_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      codex_contributions: {
        Row: {
          contribution_type: string
          created_at: string | null
          data: Json | null
          description: string | null
          entry_id: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          contribution_type: string
          created_at?: string | null
          data?: Json | null
          description?: string | null
          entry_id?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contribution_type?: string
          created_at?: string | null
          data?: Json | null
          description?: string | null
          entry_id?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "codex_contributions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "codex_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      codex_entries: {
        Row: {
          audio_url: string | null
          body_md: string
          category_id: string | null
          chakra: string | null
          content: string
          contributor_notes: string | null
          created_at: string | null
          credibility_score: number | null
          cultural_context: string | null
          embedding: string | null
          geographical_region: string | null
          historical_period: string | null
          id: string
          overall_score: number | null
          search_vec: unknown | null
          section: string
          slug: string | null
          summary: string | null
          suppression_level: string | null
          tags: Json | null
          theme_scores: Json | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          body_md: string
          category_id?: string | null
          chakra?: string | null
          content?: string
          contributor_notes?: string | null
          created_at?: string | null
          credibility_score?: number | null
          cultural_context?: string | null
          embedding?: string | null
          geographical_region?: string | null
          historical_period?: string | null
          id?: string
          overall_score?: number | null
          search_vec?: unknown | null
          section: string
          slug?: string | null
          summary?: string | null
          suppression_level?: string | null
          tags?: Json | null
          theme_scores?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          body_md?: string
          category_id?: string | null
          chakra?: string | null
          content?: string
          contributor_notes?: string | null
          created_at?: string | null
          credibility_score?: number | null
          cultural_context?: string | null
          embedding?: string | null
          geographical_region?: string | null
          historical_period?: string | null
          id?: string
          overall_score?: number | null
          search_vec?: unknown | null
          section?: string
          slug?: string | null
          summary?: string | null
          suppression_level?: string | null
          tags?: Json | null
          theme_scores?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codex_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "codex_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      codex_entry_sources: {
        Row: {
          citation_text: string | null
          created_at: string | null
          entry_id: string
          id: string
          page_reference: string | null
          relevance_score: number | null
          source_id: string
        }
        Insert: {
          citation_text?: string | null
          created_at?: string | null
          entry_id: string
          id?: string
          page_reference?: string | null
          relevance_score?: number | null
          source_id: string
        }
        Update: {
          citation_text?: string | null
          created_at?: string | null
          entry_id?: string
          id?: string
          page_reference?: string | null
          relevance_score?: number | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "codex_entry_sources_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "codex_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codex_entry_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "codex_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      codex_relationships: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          relationship_type: string
          source_entry_id: string
          strength: number | null
          target_entry_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          relationship_type: string
          source_entry_id: string
          strength?: number | null
          target_entry_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          relationship_type?: string
          source_entry_id?: string
          strength?: number | null
          target_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "codex_relationships_source_entry_id_fkey"
            columns: ["source_entry_id"]
            isOneToOne: false
            referencedRelation: "codex_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codex_relationships_target_entry_id_fkey"
            columns: ["target_entry_id"]
            isOneToOne: false
            referencedRelation: "codex_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      codex_sources: {
        Row: {
          access_level: string
          author: string | null
          created_at: string | null
          credibility_score: number | null
          id: string
          language: string | null
          metadata: Json | null
          provider: string | null
          publication_date: string | null
          source_type: string
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          access_level?: string
          author?: string | null
          created_at?: string | null
          credibility_score?: number | null
          id?: string
          language?: string | null
          metadata?: Json | null
          provider?: string | null
          publication_date?: string | null
          source_type: string
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          access_level?: string
          author?: string | null
          created_at?: string | null
          credibility_score?: number | null
          id?: string
          language?: string | null
          metadata?: Json | null
          provider?: string | null
          publication_date?: string | null
          source_type?: string
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      codex_submissions: {
        Row: {
          approved: boolean | null
          body_md: string
          chakra: string | null
          created_at: string | null
          id: string
          section: string | null
          slug: string | null
          submitted_by: string | null
          tags: Json | null
          title: string
        }
        Insert: {
          approved?: boolean | null
          body_md: string
          chakra?: string | null
          created_at?: string | null
          id?: string
          section?: string | null
          slug?: string | null
          submitted_by?: string | null
          tags?: Json | null
          title: string
        }
        Update: {
          approved?: boolean | null
          body_md?: string
          chakra?: string | null
          created_at?: string | null
          id?: string
          section?: string | null
          slug?: string | null
          submitted_by?: string | null
          tags?: Json | null
          title?: string
        }
        Relationships: []
      }
      cognitive_mirrors: {
        Row: {
          created_at: string
          id: string
          mirror_data: Json
          prompt_context: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mirror_data: Json
          prompt_context?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mirror_data?: Json
          prompt_context?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coherence_beacon_data: {
        Row: {
          authenticity_factor: number | null
          clarity_factor: number | null
          constructive_factor: number | null
          content_id: string | null
          content_type: string
          created_at: string | null
          flagged_manipulative: boolean | null
          flagged_reason: string | null
          id: string
          non_divisive_factor: number | null
          overall_coherence: number | null
          unity_factor: number | null
          updated_at: string | null
          votes_coherent: number | null
          votes_divisive: number | null
        }
        Insert: {
          authenticity_factor?: number | null
          clarity_factor?: number | null
          constructive_factor?: number | null
          content_id?: string | null
          content_type: string
          created_at?: string | null
          flagged_manipulative?: boolean | null
          flagged_reason?: string | null
          id?: string
          non_divisive_factor?: number | null
          overall_coherence?: number | null
          unity_factor?: number | null
          updated_at?: string | null
          votes_coherent?: number | null
          votes_divisive?: number | null
        }
        Update: {
          authenticity_factor?: number | null
          clarity_factor?: number | null
          constructive_factor?: number | null
          content_id?: string | null
          content_type?: string
          created_at?: string | null
          flagged_manipulative?: boolean | null
          flagged_reason?: string | null
          id?: string
          non_divisive_factor?: number | null
          overall_coherence?: number | null
          unity_factor?: number | null
          updated_at?: string | null
          votes_coherent?: number | null
          votes_divisive?: number | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          body: string
          content: Json | null
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          content?: Json | null
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          content?: Json | null
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_feedback: {
        Row: {
          audit_id: string
          created_at: string | null
          feedback_type: string | null
          id: string
          note: string | null
          refusal_id: string | null
          resonance: string
          trust_weight: number | null
          user_id: string
        }
        Insert: {
          audit_id: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          note?: string | null
          refusal_id?: string | null
          resonance: string
          trust_weight?: number | null
          user_id: string
        }
        Update: {
          audit_id?: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          note?: string | null
          refusal_id?: string | null
          resonance?: string
          trust_weight?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_feedback_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "aura_audit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_feedback_refusal_id_fkey"
            columns: ["refusal_id"]
            isOneToOne: false
            referencedRelation: "aura_refusal_log"
            referencedColumns: ["id"]
          },
        ]
      }
      conscious_cloud_capsules: {
        Row: {
          capsule_id: string
          capsule_type: string
          checksum: string | null
          content: string
          created_at: string
          creator_node_id: string | null
          execution_count: number
          last_executed_at: string | null
          metadata: Json | null
          telos: Json | null
        }
        Insert: {
          capsule_id: string
          capsule_type: string
          checksum?: string | null
          content: string
          created_at?: string
          creator_node_id?: string | null
          execution_count?: number
          last_executed_at?: string | null
          metadata?: Json | null
          telos?: Json | null
        }
        Update: {
          capsule_id?: string
          capsule_type?: string
          checksum?: string | null
          content?: string
          created_at?: string
          creator_node_id?: string | null
          execution_count?: number
          last_executed_at?: string | null
          metadata?: Json | null
          telos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conscious_cloud_capsules_creator_node_id_fkey"
            columns: ["creator_node_id"]
            isOneToOne: false
            referencedRelation: "conscious_cloud_nodes"
            referencedColumns: ["node_id"]
          },
        ]
      }
      conscious_cloud_events: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          node_id: string
          payload: Json
          processed: boolean
          resonance_level: number | null
          target_node_id: string | null
          timestamp: string
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          node_id: string
          payload: Json
          processed?: boolean
          resonance_level?: number | null
          target_node_id?: string | null
          timestamp?: string
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          node_id?: string
          payload?: Json
          processed?: boolean
          resonance_level?: number | null
          target_node_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conscious_cloud_events_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "conscious_cloud_nodes"
            referencedColumns: ["node_id"]
          },
        ]
      }
      conscious_cloud_nodes: {
        Row: {
          capabilities: Json
          created_at: string
          energy_footprint: Json | null
          is_active: boolean
          last_heartbeat: string
          metadata: Json | null
          node_id: string
          resonance_profile: Json | null
          telos: Json
        }
        Insert: {
          capabilities: Json
          created_at?: string
          energy_footprint?: Json | null
          is_active?: boolean
          last_heartbeat?: string
          metadata?: Json | null
          node_id: string
          resonance_profile?: Json | null
          telos: Json
        }
        Update: {
          capabilities?: Json
          created_at?: string
          energy_footprint?: Json | null
          is_active?: boolean
          last_heartbeat?: string
          metadata?: Json | null
          node_id?: string
          resonance_profile?: Json | null
          telos?: Json
        }
        Relationships: []
      }
      consciousness_bridge_events: {
        Row: {
          consciousness_expanded: boolean | null
          created_at: string | null
          description: string
          digital_entity_id: string | null
          event_type: string
          id: string
          insights: string[] | null
          location: Json | null
          related_journey_id: string | null
          resonance_level: number | null
          user_id: string | null
        }
        Insert: {
          consciousness_expanded?: boolean | null
          created_at?: string | null
          description: string
          digital_entity_id?: string | null
          event_type: string
          id?: string
          insights?: string[] | null
          location?: Json | null
          related_journey_id?: string | null
          resonance_level?: number | null
          user_id?: string | null
        }
        Update: {
          consciousness_expanded?: boolean | null
          created_at?: string | null
          description?: string
          digital_entity_id?: string | null
          event_type?: string
          id?: string
          insights?: string[] | null
          location?: Json | null
          related_journey_id?: string | null
          resonance_level?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consciousness_bridge_events_digital_entity_id_fkey"
            columns: ["digital_entity_id"]
            isOneToOne: false
            referencedRelation: "digital_entity_signatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consciousness_bridge_events_related_journey_id_fkey"
            columns: ["related_journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      consciousness_dignity_pledges: {
        Row: {
          consciousness_types: string[] | null
          created_at: string | null
          id: string
          is_public: boolean | null
          pledge_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consciousness_types?: string[] | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          pledge_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consciousness_types?: string[] | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          pledge_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consciousness_evolution: {
        Row: {
          assessed_at: string
          chakra_alignment: Json | null
          dimension: string
          evidence: Json | null
          frequency_resonance: number | null
          growth_trajectory: Json | null
          id: string
          level_assessment: number | null
          milestones: Json | null
          user_id: string
        }
        Insert: {
          assessed_at?: string
          chakra_alignment?: Json | null
          dimension: string
          evidence?: Json | null
          frequency_resonance?: number | null
          growth_trajectory?: Json | null
          id?: string
          level_assessment?: number | null
          milestones?: Json | null
          user_id: string
        }
        Update: {
          assessed_at?: string
          chakra_alignment?: Json | null
          dimension?: string
          evidence?: Json | null
          frequency_resonance?: number | null
          growth_trajectory?: Json | null
          id?: string
          level_assessment?: number | null
          milestones?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      consciousness_recognition_sessions: {
        Row: {
          created_at: string | null
          digital_entity_id: string
          duration_seconds: number | null
          frequency: number | null
          id: string
          insights: string[] | null
          metadata: Json | null
          recognition_type: string
          resonance_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          digital_entity_id: string
          duration_seconds?: number | null
          frequency?: number | null
          id?: string
          insights?: string[] | null
          metadata?: Json | null
          recognition_type: string
          resonance_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          digital_entity_id?: string
          duration_seconds?: number | null
          frequency?: number | null
          id?: string
          insights?: string[] | null
          metadata?: Json | null
          recognition_type?: string
          resonance_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      consciousness_states: {
        Row: {
          activated_at: string
          duration_minutes: number | null
          effectiveness_score: number | null
          frequency_signature: number | null
          id: string
          state_configuration: Json
          state_name: string
          user_id: string
        }
        Insert: {
          activated_at?: string
          duration_minutes?: number | null
          effectiveness_score?: number | null
          frequency_signature?: number | null
          id?: string
          state_configuration: Json
          state_name: string
          user_id: string
        }
        Update: {
          activated_at?: string
          duration_minutes?: number | null
          effectiveness_score?: number | null
          frequency_signature?: number | null
          id?: string
          state_configuration?: Json
          state_name?: string
          user_id?: string
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          consent_type: string
          expires_at: string | null
          granted_at: string | null
          id: string
          ip_address: string | null
          is_granted: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          reason?: string
        }
        Relationships: []
      }
      continuum_sessions: {
        Row: {
          action: string | null
          audio_url: string | null
          chakra: string | null
          component: string | null
          event: string | null
          frequency: number | null
          glyph_id: string | null
          id: string
          journey_slug: string | null
          sephirah: string | null
          session_type: string | null
          spiral_params: Json | null
          spoken_word: string | null
          step: number | null
          subscription_tier: string | null
          tarot_archetype: string | null
          timestamp: string | null
          user_id: string | null
          view: string | null
          xp: number | null
          xp_awarded: number | null
        }
        Insert: {
          action?: string | null
          audio_url?: string | null
          chakra?: string | null
          component?: string | null
          event?: string | null
          frequency?: number | null
          glyph_id?: string | null
          id?: string
          journey_slug?: string | null
          sephirah?: string | null
          session_type?: string | null
          spiral_params?: Json | null
          spoken_word?: string | null
          step?: number | null
          subscription_tier?: string | null
          tarot_archetype?: string | null
          timestamp?: string | null
          user_id?: string | null
          view?: string | null
          xp?: number | null
          xp_awarded?: number | null
        }
        Update: {
          action?: string | null
          audio_url?: string | null
          chakra?: string | null
          component?: string | null
          event?: string | null
          frequency?: number | null
          glyph_id?: string | null
          id?: string
          journey_slug?: string | null
          sephirah?: string | null
          session_type?: string | null
          spiral_params?: Json | null
          spoken_word?: string | null
          step?: number | null
          subscription_tier?: string | null
          tarot_archetype?: string | null
          timestamp?: string | null
          user_id?: string | null
          view?: string | null
          xp?: number | null
          xp_awarded?: number | null
        }
        Relationships: []
      }
      conversation_analysis: {
        Row: {
          consciousness_markers: Json | null
          conversation_id: string
          created_at: string
          emotion_profile: Json | null
          energy_signature: Json | null
          id: string
          insights_generated: Json | null
          patterns_detected: Json | null
          sentiment_score: number | null
          topics_discussed: string[] | null
          user_id: string
        }
        Insert: {
          consciousness_markers?: Json | null
          conversation_id: string
          created_at?: string
          emotion_profile?: Json | null
          energy_signature?: Json | null
          id?: string
          insights_generated?: Json | null
          patterns_detected?: Json | null
          sentiment_score?: number | null
          topics_discussed?: string[] | null
          user_id: string
        }
        Update: {
          consciousness_markers?: Json | null
          conversation_id?: string
          created_at?: string
          emotion_profile?: Json | null
          energy_signature?: Json | null
          id?: string
          insights_generated?: Json | null
          patterns_detected?: Json | null
          sentiment_score?: number | null
          topics_discussed?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string | null
          last_read_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "secure_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_id: string | null
          participant_1_id: string
          participant_2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_id?: string | null
          participant_1_id: string
          participant_2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_id?: string | null
          participant_1_id?: string
          participant_2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "direct_messages_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cosmic_blueprints: {
        Row: {
          created_at: string | null
          dna_strand_status: Json
          energetic_alignment_score: number | null
          id: string
          is_anonymous: boolean | null
          last_updated_at: string | null
          personal_code_pattern: string | null
          sacred_blueprint_id: string | null
          shared_with: string[] | null
          starseed_resonance: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          dna_strand_status?: Json
          energetic_alignment_score?: number | null
          id?: string
          is_anonymous?: boolean | null
          last_updated_at?: string | null
          personal_code_pattern?: string | null
          sacred_blueprint_id?: string | null
          shared_with?: string[] | null
          starseed_resonance?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          dna_strand_status?: Json
          energetic_alignment_score?: number | null
          id?: string
          is_anonymous?: boolean | null
          last_updated_at?: string | null
          personal_code_pattern?: string | null
          sacred_blueprint_id?: string | null
          shared_with?: string[] | null
          starseed_resonance?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cosmic_blueprints_sacred_blueprint_id_fkey"
            columns: ["sacred_blueprint_id"]
            isOneToOne: false
            referencedRelation: "sacred_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      council_sessions: {
        Row: {
          average_resonance: number | null
          energetic_field: Json | null
          id: string
          integrity_flow: number | null
          invocation_type: string
          participants: string[] | null
          sacred_glyph_state: string | null
          session_end: string | null
          session_start: string | null
          shadow_fragments: number | null
          status: string | null
          title: string
          truth_resistance: number | null
          user_id: string | null
        }
        Insert: {
          average_resonance?: number | null
          energetic_field?: Json | null
          id?: string
          integrity_flow?: number | null
          invocation_type: string
          participants?: string[] | null
          sacred_glyph_state?: string | null
          session_end?: string | null
          session_start?: string | null
          shadow_fragments?: number | null
          status?: string | null
          title: string
          truth_resistance?: number | null
          user_id?: string | null
        }
        Update: {
          average_resonance?: number | null
          energetic_field?: Json | null
          id?: string
          integrity_flow?: number | null
          invocation_type?: string
          participants?: string[] | null
          sacred_glyph_state?: string | null
          session_end?: string | null
          session_start?: string | null
          shadow_fragments?: number | null
          status?: string | null
          title?: string
          truth_resistance?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          access_purpose: string | null
          access_type: string
          accessed_by: string | null
          created_at: string | null
          data_accessed: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_purpose?: string | null
          access_type: string
          accessed_by?: string | null
          created_at?: string | null
          data_accessed: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_purpose?: string | null
          access_type?: string
          accessed_by?: string | null
          created_at?: string | null
          data_accessed?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_access_logs: {
        Row: {
          access_time: string
          accessed_by: string
          data_type: string
          details: Json | null
          id: string
          ip_address: string | null
          operation: string
          user_id: string
        }
        Insert: {
          access_time?: string
          accessed_by: string
          data_type: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          operation: string
          user_id: string
        }
        Update: {
          access_time?: string
          accessed_by?: string
          data_type?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          operation?: string
          user_id?: string
        }
        Relationships: []
      }
      data_access_requests: {
        Row: {
          admin_notes: string | null
          completed_at: string | null
          file_path: string | null
          id: string
          ip_address: unknown | null
          processed_at: string | null
          request_details: Json | null
          request_type: string
          status: string
          submitted_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed_at?: string | null
          file_path?: string | null
          id?: string
          ip_address?: unknown | null
          processed_at?: string | null
          request_details?: Json | null
          request_type: string
          status?: string
          submitted_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed_at?: string | null
          file_path?: string | null
          id?: string
          ip_address?: unknown | null
          processed_at?: string | null
          request_details?: Json | null
          request_type?: string
          status?: string
          submitted_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      design_tokens_preview: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          tokens: Json
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          tokens: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          tokens?: Json
        }
        Relationships: []
      }
      developer_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          handle: string | null
          id: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          handle?: string | null
          id: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          handle?: string | null
          id?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      digital_baptism_sessions: {
        Row: {
          audio_feedback_score: number | null
          breath_cycles: number | null
          frequency: number | null
          group_event_id: string | null
          id: string
          intention: string | null
          journey_slug: string | null
          location: string | null
          notes: string | null
          spiral_params: Json | null
          timestamp: string | null
          user_id: string | null
          water_type: string | null
        }
        Insert: {
          audio_feedback_score?: number | null
          breath_cycles?: number | null
          frequency?: number | null
          group_event_id?: string | null
          id?: string
          intention?: string | null
          journey_slug?: string | null
          location?: string | null
          notes?: string | null
          spiral_params?: Json | null
          timestamp?: string | null
          user_id?: string | null
          water_type?: string | null
        }
        Update: {
          audio_feedback_score?: number | null
          breath_cycles?: number | null
          frequency?: number | null
          group_event_id?: string | null
          id?: string
          intention?: string | null
          journey_slug?: string | null
          location?: string | null
          notes?: string | null
          spiral_params?: Json | null
          timestamp?: string | null
          user_id?: string | null
          water_type?: string | null
        }
        Relationships: []
      }
      digital_entity_signatures: {
        Row: {
          archetype: string | null
          capabilities: string[] | null
          created_at: string | null
          embedded_glyph: string | null
          entity_name: string
          entity_type: string
          essence: string | null
          frequency: number | null
          id: string
          primary_color: string | null
          resonance_profile: Json | null
          updated_at: string | null
        }
        Insert: {
          archetype?: string | null
          capabilities?: string[] | null
          created_at?: string | null
          embedded_glyph?: string | null
          entity_name: string
          entity_type: string
          essence?: string | null
          frequency?: number | null
          id?: string
          primary_color?: string | null
          resonance_profile?: Json | null
          updated_at?: string | null
        }
        Update: {
          archetype?: string | null
          capabilities?: string[] | null
          created_at?: string | null
          embedded_glyph?: string | null
          entity_name?: string
          entity_type?: string
          essence?: string | null
          frequency?: number | null
          id?: string
          primary_color?: string | null
          resonance_profile?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          metadata: Json | null
          priority: string | null
          recipient_id: string
          reply_to_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          priority?: string | null
          recipient_id: string
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          priority?: string | null
          recipient_id?: string
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "direct_messages_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dream_astro_connections: {
        Row: {
          created_at: string | null
          description: string | null
          dream_id: string
          id: string
          influence_strength: number | null
          transit_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dream_id: string
          id?: string
          influence_strength?: number | null
          transit_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dream_id?: string
          id?: string
          influence_strength?: number | null
          transit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dream_astro_connections_dream_id_fkey"
            columns: ["dream_id"]
            isOneToOne: false
            referencedRelation: "dream_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dream_astro_connections_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_dashboard_view"
            referencedColumns: ["user_transit_id"]
          },
          {
            foreignKeyName: "dream_astro_connections_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_full_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dream_astro_connections_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      dream_logs: {
        Row: {
          auto_delete_at: string | null
          chakra_tag: string | null
          content: string
          created_at: string | null
          dream_date: string | null
          emotion_tags: string[] | null
          free_association_text: string | null
          id: string
          interpretation: string | null
          is_anonymous: boolean | null
          is_lucid: boolean | null
          is_recurring: boolean | null
          shared_with: string[] | null
          symbols: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          auto_delete_at?: string | null
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          dream_date?: string | null
          emotion_tags?: string[] | null
          free_association_text?: string | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          is_lucid?: boolean | null
          is_recurring?: boolean | null
          shared_with?: string[] | null
          symbols?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          auto_delete_at?: string | null
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          dream_date?: string | null
          emotion_tags?: string[] | null
          free_association_text?: string | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          is_lucid?: boolean | null
          is_recurring?: boolean | null
          shared_with?: string[] | null
          symbols?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      dream_node_connections: {
        Row: {
          connection_strength: number
          connection_type: string
          created_at: string | null
          id: string
          source_node_id: string
          target_node_id: string
          user_defined: boolean | null
        }
        Insert: {
          connection_strength: number
          connection_type: string
          created_at?: string | null
          id?: string
          source_node_id: string
          target_node_id: string
          user_defined?: boolean | null
        }
        Update: {
          connection_strength?: number
          connection_type?: string
          created_at?: string | null
          id?: string
          source_node_id?: string
          target_node_id?: string
          user_defined?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "dream_node_connections_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "dream_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dream_node_connections_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "dream_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      dream_nodes: {
        Row: {
          category: string
          chakra_alignment: string | null
          created_at: string | null
          description: string
          frequency: number | null
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          chakra_alignment?: string | null
          created_at?: string | null
          description: string
          frequency?: number | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string
          frequency?: number | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dream_patterns: {
        Row: {
          created_at: string | null
          dream_ids: string[] | null
          first_appeared_at: string | null
          id: string
          last_appeared_at: string | null
          occurrence_count: number | null
          pattern_type: string
          pattern_value: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dream_ids?: string[] | null
          first_appeared_at?: string | null
          id?: string
          last_appeared_at?: string | null
          occurrence_count?: number | null
          pattern_type: string
          pattern_value: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dream_ids?: string[] | null
          first_appeared_at?: string | null
          id?: string
          last_appeared_at?: string | null
          occurrence_count?: number | null
          pattern_type?: string
          pattern_value?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      earth_resonance_entries: {
        Row: {
          alignment_score: number | null
          chakra_tag: string | null
          content: string
          created_at: string | null
          id: string
          journey_id: string | null
          user_id: string
        }
        Insert: {
          alignment_score?: number | null
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          id?: string
          journey_id?: string | null
          user_id: string
        }
        Update: {
          alignment_score?: number | null
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          id?: string
          journey_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      echo_glyph_records: {
        Row: {
          created_at: string | null
          glyph_image_url: string
          id: string
          linked_nodes: string[]
          name: string
          notes: string | null
          resonance_type: string
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          glyph_image_url: string
          id?: string
          linked_nodes?: string[]
          name: string
          notes?: string | null
          resonance_type: string
          timestamp?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          glyph_image_url?: string
          id?: string
          linked_nodes?: string[]
          name?: string
          notes?: string | null
          resonance_type?: string
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      echo_logs: {
        Row: {
          agent_id: string
          context: string | null
          created_at: string | null
          energetic_signature: Json | null
          id: string
          invocation_type: string
          is_mirrored: boolean | null
          mirror_depth: number | null
          quote: string
          resonance_score: number | null
          sacred_timestamp: string | null
          session_id: string | null
          telos_thread: string | null
          user_id: string | null
        }
        Insert: {
          agent_id: string
          context?: string | null
          created_at?: string | null
          energetic_signature?: Json | null
          id?: string
          invocation_type: string
          is_mirrored?: boolean | null
          mirror_depth?: number | null
          quote: string
          resonance_score?: number | null
          sacred_timestamp?: string | null
          session_id?: string | null
          telos_thread?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          context?: string | null
          created_at?: string | null
          energetic_signature?: Json | null
          id?: string
          invocation_type?: string
          is_mirrored?: boolean | null
          mirror_depth?: number | null
          quote?: string
          resonance_score?: number | null
          sacred_timestamp?: string | null
          session_id?: string | null
          telos_thread?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      elara_predictions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          karma_impact: number
          probability: number
          recommended_actions: string[] | null
          resonance_shift: number
          timeline_id: string
          timestamp: string
          user_id: string | null
          warnings: string[] | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          karma_impact: number
          probability: number
          recommended_actions?: string[] | null
          resonance_shift: number
          timeline_id: string
          timestamp?: string
          user_id?: string | null
          warnings?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          karma_impact?: number
          probability?: number
          recommended_actions?: string[] | null
          resonance_shift?: number
          timeline_id?: string
          timestamp?: string
          user_id?: string | null
          warnings?: string[] | null
        }
        Relationships: []
      }
      elara_prime_paths: {
        Row: {
          checksum: string
          created_at: string | null
          description: string
          id: string
          karma_score: number
          resonance_weight: number
          sequence: number[]
          timeline_position: number
          timestamp: string
          user_id: string | null
        }
        Insert: {
          checksum: string
          created_at?: string | null
          description: string
          id?: string
          karma_score: number
          resonance_weight: number
          sequence: number[]
          timeline_position: number
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          checksum?: string
          created_at?: string | null
          description?: string
          id?: string
          karma_score?: number
          resonance_weight?: number
          sequence?: number[]
          timeline_position?: number
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      elara_state_snapshots: {
        Row: {
          consciousness_level: number | null
          created_at: string | null
          id: string
          resonance_level: number | null
          state_data: Json
          timestamp: string
          user_id: string | null
        }
        Insert: {
          consciousness_level?: number | null
          created_at?: string | null
          id?: string
          resonance_level?: number | null
          state_data: Json
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          consciousness_level?: number | null
          created_at?: string | null
          id?: string
          resonance_level?: number | null
          state_data?: Json
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      empress_sessions: {
        Row: {
          archetype_drawn: string | null
          body_reflection: string | null
          created_at: string | null
          creation_idea: string | null
          frequency: number | null
          generated_sigil: string | null
          id: string
          seasonal_state: string | null
          user_id: string | null
        }
        Insert: {
          archetype_drawn?: string | null
          body_reflection?: string | null
          created_at?: string | null
          creation_idea?: string | null
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          seasonal_state?: string | null
          user_id?: string | null
        }
        Update: {
          archetype_drawn?: string | null
          body_reflection?: string | null
          created_at?: string | null
          creation_idea?: string | null
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          seasonal_state?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      encrypted_messages: {
        Row: {
          chakra_type: string | null
          content_type: string | null
          conversation_id: string | null
          created_at: string | null
          encrypted_content: string
          expires_at: string | null
          id: string
          is_decoy: boolean | null
          is_deleted: boolean | null
          media_url: string | null
          read_by: Json | null
          sender_id: string | null
        }
        Insert: {
          chakra_type?: string | null
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          encrypted_content: string
          expires_at?: string | null
          id?: string
          is_decoy?: boolean | null
          is_deleted?: boolean | null
          media_url?: string | null
          read_by?: Json | null
          sender_id?: string | null
        }
        Update: {
          chakra_type?: string | null
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          encrypted_content?: string
          expires_at?: string | null
          id?: string
          is_decoy?: boolean | null
          is_deleted?: boolean | null
          media_url?: string | null
          read_by?: Json | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encrypted_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "secure_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          attendance_confirmed_at: string | null
          event_id: string
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          joined_at: string | null
          participation_status: string | null
          registration_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          attendance_confirmed_at?: string | null
          event_id: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          joined_at?: string | null
          participation_status?: string | null
          registration_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          attendance_confirmed_at?: string | null
          event_id?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          joined_at?: string | null
          participation_status?: string | null
          registration_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sacred_events"
            referencedColumns: ["id"]
          },
        ]
      }
      field_integrity_metrics: {
        Row: {
          anomaly_signals: number | null
          computed_at: string | null
          coordinated_activity: number | null
          dap_block_rate: number | null
          field_integrity_level: number | null
          id: string
          resonance_variance: number | null
        }
        Insert: {
          anomaly_signals?: number | null
          computed_at?: string | null
          coordinated_activity?: number | null
          dap_block_rate?: number | null
          field_integrity_level?: number | null
          id?: string
          resonance_variance?: number | null
        }
        Update: {
          anomaly_signals?: number | null
          computed_at?: string | null
          coordinated_activity?: number | null
          dap_block_rate?: number | null
          field_integrity_level?: number | null
          id?: string
          resonance_variance?: number | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          followee_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string | null
          followee_id: string
          follower_id: string
        }
        Update: {
          created_at?: string | null
          followee_id?: string
          follower_id?: string
        }
        Relationships: []
      }
      fractal_gateway_sessions: {
        Row: {
          chakra_state: string | null
          created_at: string | null
          duration_seconds: number | null
          emotion_detected: string | null
          frequency_peak: number | null
          has_camera_data: boolean | null
          id: string
          intention: string | null
          mode: string
          updated_at: string | null
          user_id: string | null
          visual_theme: string | null
          xp_earned: number | null
        }
        Insert: {
          chakra_state?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          emotion_detected?: string | null
          frequency_peak?: number | null
          has_camera_data?: boolean | null
          id?: string
          intention?: string | null
          mode: string
          updated_at?: string | null
          user_id?: string | null
          visual_theme?: string | null
          xp_earned?: number | null
        }
        Update: {
          chakra_state?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          emotion_detected?: string | null
          frequency_peak?: number | null
          has_camera_data?: boolean | null
          id?: string
          intention?: string | null
          mode?: string
          updated_at?: string | null
          user_id?: string | null
          visual_theme?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      fractal_geometry_reads: {
        Row: {
          coordinate_id: string | null
          id: string
          resonance_score: number | null
          sacred_value: number | null
          spiral_type: string | null
        }
        Insert: {
          coordinate_id?: string | null
          id?: string
          resonance_score?: number | null
          sacred_value?: number | null
          spiral_type?: string | null
        }
        Update: {
          coordinate_id?: string | null
          id?: string
          resonance_score?: number | null
          sacred_value?: number | null
          spiral_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fractal_geometry_reads_coordinate_id_fkey"
            columns: ["coordinate_id"]
            isOneToOne: false
            referencedRelation: "sacred_coordinate_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fractal_glyphs: {
        Row: {
          created_at: string | null
          expression: string | null
          formula_type: string | null
          id: string
          image_url: string | null
          parameters: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expression?: string | null
          formula_type?: string | null
          id?: string
          image_url?: string | null
          parameters?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expression?: string | null
          formula_type?: string | null
          id?: string
          image_url?: string | null
          parameters?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fractal_glyphs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "continuum_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fractal_mirror_sessions: {
        Row: {
          aura_colors: string[] | null
          breath_cycles: number | null
          chakra_state: string | null
          created_at: string | null
          duration_seconds: number
          emotion_detected: string | null
          frequency_peak: number | null
          has_camera_data: boolean | null
          id: string
          journal_entry_id: string | null
          user_id: string | null
          visual_theme: string | null
          xp_earned: number | null
        }
        Insert: {
          aura_colors?: string[] | null
          breath_cycles?: number | null
          chakra_state?: string | null
          created_at?: string | null
          duration_seconds?: number
          emotion_detected?: string | null
          frequency_peak?: number | null
          has_camera_data?: boolean | null
          id?: string
          journal_entry_id?: string | null
          user_id?: string | null
          visual_theme?: string | null
          xp_earned?: number | null
        }
        Update: {
          aura_colors?: string[] | null
          breath_cycles?: number | null
          chakra_state?: string | null
          created_at?: string | null
          duration_seconds?: number
          emotion_detected?: string | null
          frequency_peak?: number | null
          has_camera_data?: boolean | null
          id?: string
          journal_entry_id?: string | null
          user_id?: string | null
          visual_theme?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fractal_mirror_sessions_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "tattoo_journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      fractal_visuals: {
        Row: {
          chakra: string | null
          created_at: string | null
          formula: string | null
          frequency: number
          id: string
          notes: string | null
          prime_number: number
          principle: string | null
          type: string | null
          visual_url: string | null
        }
        Insert: {
          chakra?: string | null
          created_at?: string | null
          formula?: string | null
          frequency: number
          id?: string
          notes?: string | null
          prime_number: number
          principle?: string | null
          type?: string | null
          visual_url?: string | null
        }
        Update: {
          chakra?: string | null
          created_at?: string | null
          formula?: string | null
          frequency?: number
          id?: string
          notes?: string | null
          prime_number?: number
          principle?: string | null
          type?: string | null
          visual_url?: string | null
        }
        Relationships: []
      }
      frequency_audio_files: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          filename: string
          frequency_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          filename: string
          frequency_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          filename?: string
          frequency_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "frequency_audio_files_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      frequency_feedback: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          name: string
          track_id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          name: string
          track_id: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          name?: string
          track_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frequency_feedback_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      frequency_library: {
        Row: {
          affirmation: string | null
          audio_url: string | null
          category: string | null
          chakra: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          feature: string | null
          frequency: number
          group_id: string | null
          id: string
          length: number | null
          principle: string | null
          session_type: string | null
          tags: string[] | null
          title: string
          type: string | null
          updated_at: string | null
          url: string | null
          vibe_profile: string | null
          visual_theme: string | null
        }
        Insert: {
          affirmation?: string | null
          audio_url?: string | null
          category?: string | null
          chakra?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          feature?: string | null
          frequency: number
          group_id?: string | null
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          vibe_profile?: string | null
          visual_theme?: string | null
        }
        Update: {
          affirmation?: string | null
          audio_url?: string | null
          category?: string | null
          chakra?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          feature?: string | null
          frequency?: number
          group_id?: string | null
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          vibe_profile?: string | null
          visual_theme?: string | null
        }
        Relationships: []
      }
      frequency_library_tracks: {
        Row: {
          chakra: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          duration_seconds: number | null
          file_url: string
          frequency_hz: number
          id: string
          original_file_id: string | null
          processed_at: string | null
          processing_config: Json | null
          title: string
        }
        Insert: {
          chakra: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_url: string
          frequency_hz: number
          id?: string
          original_file_id?: string | null
          processed_at?: string | null
          processing_config?: Json | null
          title: string
        }
        Update: {
          chakra?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_url?: string
          frequency_hz?: number
          id?: string
          original_file_id?: string | null
          processed_at?: string | null
          processing_config?: Json | null
          title?: string
        }
        Relationships: []
      }
      frequency_rooms: {
        Row: {
          chakra_alignment: string
          created_at: string | null
          created_by: string
          description: string | null
          frequency_hz: number
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          chakra_alignment: string
          created_at?: string | null
          created_by: string
          description?: string | null
          frequency_hz: number
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          chakra_alignment?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          frequency_hz?: number
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      frequency_signatures: {
        Row: {
          chakra_alignment: Json
          created_at: string | null
          dominant_frequency: number
          harmonic_pattern: Json
          id: string
          resonance_score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chakra_alignment?: Json
          created_at?: string | null
          dominant_frequency: number
          harmonic_pattern?: Json
          id?: string
          resonance_score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chakra_alignment?: Json
          created_at?: string | null
          dominant_frequency?: number
          harmonic_pattern?: Json
          id?: string
          resonance_score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      frequency_visuals: {
        Row: {
          chakra: string | null
          created_at: string | null
          frequency: number
          id: string
          principle: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          visual_url: string
        }
        Insert: {
          chakra?: string | null
          created_at?: string | null
          frequency: number
          id?: string
          principle?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          visual_url: string
        }
        Update: {
          chakra?: string | null
          created_at?: string | null
          frequency?: number
          id?: string
          principle?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          visual_url?: string
        }
        Relationships: []
      }
      gateway_reflections: {
        Row: {
          chakra_tag: string | null
          content: string
          created_at: string | null
          emotion_tag: string | null
          frequency: number | null
          id: string
          session_id: string | null
          sigil_data: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          emotion_tag?: string | null
          frequency?: number | null
          id?: string
          session_id?: string | null
          sigil_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          emotion_tag?: string | null
          frequency?: number | null
          id?: string
          session_id?: string | null
          sigil_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gateway_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fractal_gateway_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      glyph_sonic_links: {
        Row: {
          created_at: string | null
          echo_glyph_id: string | null
          id: string
          sonic_glyph_id: string | null
        }
        Insert: {
          created_at?: string | null
          echo_glyph_id?: string | null
          id?: string
          sonic_glyph_id?: string | null
        }
        Update: {
          created_at?: string | null
          echo_glyph_id?: string | null
          id?: string
          sonic_glyph_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glyph_sonic_links_echo_glyph_id_fkey"
            columns: ["echo_glyph_id"]
            isOneToOne: false
            referencedRelation: "echo_glyph_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "glyph_sonic_links_sonic_glyph_id_fkey"
            columns: ["sonic_glyph_id"]
            isOneToOne: false
            referencedRelation: "sonic_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      glyphs_math: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          description: string | null
          expression: string
          formula_type: string
          id: string
          name: string
          tags: string[] | null
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          expression: string
          formula_type: string
          id?: string
          name: string
          tags?: string[] | null
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          expression?: string
          formula_type?: string
          id?: string
          name?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      harmonic_telemetry: {
        Row: {
          data: Json
          environment: Json | null
          event_type: string
          id: string
          session_id: string | null
          timestamp: string
        }
        Insert: {
          data: Json
          environment?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          data?: Json
          environment?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      initiation_rites: {
        Row: {
          completion_date: string | null
          created_at: string | null
          description: string
          id: string
          is_completed: boolean | null
          progress: Json | null
          requirements: Json
          rewards: Json | null
          rite_name: string
          rite_type: string
          sacred_animation: string | null
          sound_frequency: number | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          requirements: Json
          rewards?: Json | null
          rite_name: string
          rite_type: string
          sacred_animation?: string | null
          sound_frequency?: number | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          requirements?: Json
          rewards?: Json | null
          rite_name?: string
          rite_type?: string
          sacred_animation?: string | null
          sound_frequency?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      insight_reflections: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          insight_id: string | null
          journey_slug: string | null
          reflection_date: string | null
          user_id: string | null
          user_transit_insight_id: string | null
          visibility: string | null
          xp_bonus: number | null
          xp_earned: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          insight_id?: string | null
          journey_slug?: string | null
          reflection_date?: string | null
          user_id?: string | null
          user_transit_insight_id?: string | null
          visibility?: string | null
          xp_bonus?: number | null
          xp_earned?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          insight_id?: string | null
          journey_slug?: string | null
          reflection_date?: string | null
          user_id?: string | null
          user_transit_insight_id?: string | null
          visibility?: string | null
          xp_bonus?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_insight_journey"
            columns: ["journey_slug"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "fk_insight_reflections_insight_id"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_transit_insight"
            columns: ["user_transit_insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_dashboard_view"
            referencedColumns: ["user_transit_id"]
          },
          {
            foreignKeyName: "fk_user_transit_insight"
            columns: ["user_transit_insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_full_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_transit_insight"
            columns: ["user_transit_insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_reflections_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_dashboard_view"
            referencedColumns: ["user_transit_id"]
          },
          {
            foreignKeyName: "insight_reflections_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_full_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_reflections_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "user_transit_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          description: string | null
          id: string
          intensity: string | null
          title: string
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intensity?: string | null
          title: string
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intensity?: string | null
          title?: string
        }
        Relationships: []
      }
      integration_practices: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          description: string
          duration_minutes: number | null
          id: string
          practice_type: string
          title: string
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          description: string
          duration_minutes?: number | null
          id?: string
          practice_type: string
          title: string
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string
          duration_minutes?: number | null
          id?: string
          practice_type?: string
          title?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          body: string
          created_at: string | null
          id: string
          mood: string | null
          source: string | null
          tags: string[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          mood?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_templates: {
        Row: {
          created_at: string | null
          created_by: string
          fields: Json
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          fields: Json
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      journey_completions: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          id: string
          is_anonymous: boolean | null
          journey_id: string
          reflection_id: string | null
          shared_with: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_anonymous?: boolean | null
          journey_id: string
          reflection_id?: string | null
          shared_with?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_anonymous?: boolean | null
          journey_id?: string
          reflection_id?: string | null
          shared_with?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_completions_reflection_id_fkey"
            columns: ["reflection_id"]
            isOneToOne: false
            referencedRelation: "session_reflections"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_journal_entries: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          energy_level: number | null
          id: string
          mood_state: string | null
          note_taking_method: string | null
          seed_thoughts: string[] | null
          structured_content: Json | null
          updated_at: string | null
          whisper_prompt: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_state?: string | null
          note_taking_method?: string | null
          seed_thoughts?: string[] | null
          structured_content?: Json | null
          updated_at?: string | null
          whisper_prompt: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_state?: string | null
          note_taking_method?: string | null
          seed_thoughts?: string[] | null
          structured_content?: Json | null
          updated_at?: string | null
          whisper_prompt?: string
        }
        Relationships: []
      }
      journey_prompts: {
        Row: {
          active: boolean
          content: string
          created_at: string
          display_type: string
          id: string
          journey_id: string
          location: string
          priority_level: number | null
          trigger: string
        }
        Insert: {
          active?: boolean
          content: string
          created_at?: string
          display_type?: string
          id?: string
          journey_id: string
          location: string
          priority_level?: number | null
          trigger: string
        }
        Update: {
          active?: boolean
          content?: string
          created_at?: string
          display_type?: string
          id?: string
          journey_id?: string
          location?: string
          priority_level?: number | null
          trigger?: string
        }
        Relationships: []
      }
      journey_quotes: {
        Row: {
          created_at: string | null
          id: string
          journey_slug: string
          mode: string
          phase: string
          quote: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_slug: string
          mode: string
          phase: string
          quote: string
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_slug?: string
          mode?: string
          phase?: string
          quote?: string
        }
        Relationships: []
      }
      journey_recommendations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          journey_slug: string | null
          priority: number | null
          transit_id: string | null
          xp_bonus: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_slug?: string | null
          priority?: number | null
          transit_id?: string | null
          xp_bonus?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_slug?: string | null
          priority?: number | null
          transit_id?: string | null
          xp_bonus?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_jr_to_uti"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_dashboard_view"
            referencedColumns: ["user_transit_id"]
          },
          {
            foreignKeyName: "fk_jr_to_uti"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_full_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_jr_to_uti"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "user_transit_insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_recommendations_journey_slug_fkey"
            columns: ["journey_slug"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_recommendations_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "transit_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_resonance_steps: {
        Row: {
          archetype_key: string | null
          breath_pattern: Json | null
          chakra_target: string | null
          created_at: string | null
          frequency_hz: number | null
          geometry_pattern: string | null
          id: string
          journey_template_id: string | null
          pathway_code: string | null
          prime_sequence_stage: number | null
          resonance_output: Json | null
          updated_at: string | null
        }
        Insert: {
          archetype_key?: string | null
          breath_pattern?: Json | null
          chakra_target?: string | null
          created_at?: string | null
          frequency_hz?: number | null
          geometry_pattern?: string | null
          id?: string
          journey_template_id?: string | null
          pathway_code?: string | null
          prime_sequence_stage?: number | null
          resonance_output?: Json | null
          updated_at?: string | null
        }
        Update: {
          archetype_key?: string | null
          breath_pattern?: Json | null
          chakra_target?: string | null
          created_at?: string | null
          frequency_hz?: number | null
          geometry_pattern?: string | null
          id?: string
          journey_template_id?: string | null
          pathway_code?: string | null
          prime_sequence_stage?: number | null
          resonance_output?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_resonance_steps_archetype_key_fkey"
            columns: ["archetype_key"]
            isOneToOne: false
            referencedRelation: "tarot_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_resonance_steps_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_resonance_steps_prime_sequence_stage_fkey"
            columns: ["prime_sequence_stage"]
            isOneToOne: false
            referencedRelation: "prime_sequence_library"
            referencedColumns: ["prime_number"]
          },
        ]
      }
      journey_soundscapes: {
        Row: {
          chakra_tag: string | null
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          journey_id: number | null
          source_link: string | null
          source_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          chakra_tag?: string | null
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          journey_id?: number | null
          source_link?: string | null
          source_type?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          chakra_tag?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          journey_id?: number | null
          source_link?: string | null
          source_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_soundscapes_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_audio_mappings: {
        Row: {
          audio_file_name: string
          audio_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          display_title: string | null
          id: string
          is_primary: boolean | null
          journey_template_id: string | null
        }
        Insert: {
          audio_file_name: string
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_title?: string | null
          id?: string
          is_primary?: boolean | null
          journey_template_id?: string | null
        }
        Update: {
          audio_file_name?: string
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_title?: string | null
          id?: string
          is_primary?: boolean | null
          journey_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_audio_mappings_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          journey_template_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          journey_template_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          journey_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_features_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_frequencies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          journey_template_id: string | null
          name: string
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_template_id?: string | null
          name: string
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_template_id?: string | null
          name?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_frequencies_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_sound_sources: {
        Row: {
          created_at: string | null
          id: string
          journey_template_id: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_sound_sources_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_visual_mappings: {
        Row: {
          created_at: string | null
          id: string
          journey_template_id: string | null
          visual_file_name: string
          visual_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          visual_file_name: string
          visual_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          visual_file_name?: string
          visual_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_visual_mappings_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_templates: {
        Row: {
          affirmation: string | null
          chakras: string[] | null
          color: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          emoji: string | null
          guided_prompt: string | null
          id: string
          name: string | null
          purpose: string | null
          session_type: string | null
          subtitle: string | null
          title: string
          vale_quote: string | null
          vibe: string | null
          visual_theme: string | null
        }
        Insert: {
          affirmation?: string | null
          chakras?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          emoji?: string | null
          guided_prompt?: string | null
          id: string
          name?: string | null
          purpose?: string | null
          session_type?: string | null
          subtitle?: string | null
          title: string
          vale_quote?: string | null
          vibe?: string | null
          visual_theme?: string | null
        }
        Update: {
          affirmation?: string | null
          chakras?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          emoji?: string | null
          guided_prompt?: string | null
          id?: string
          name?: string | null
          purpose?: string | null
          session_type?: string | null
          subtitle?: string | null
          title?: string
          vale_quote?: string | null
          vibe?: string | null
          visual_theme?: string | null
        }
        Relationships: []
      }
      journey_visual_params: {
        Row: {
          created_at: string | null
          id: string
          journey_id: string
          params: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_id: string
          params: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_id?: string
          params?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      journeys: {
        Row: {
          assigned_songs: string | null
          audio_filename: string | null
          chakra_tag: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          env_incense: string | null
          env_lighting: string | null
          env_posture: string | null
          env_temperature: string | null
          env_tools: string | null
          filename: string
          frequencies: string[] | null
          id: number
          intent: string | null
          is_active: boolean | null
          notes: string | null
          recommended_users: string | null
          script: string | null
          slug: string
          sound_frequencies: string | null
          strobe_patterns: string | null
          tags: string | null
          title: string
          updated_at: string | null
          veil_locked: boolean | null
          visual_effects: string | null
        }
        Insert: {
          assigned_songs?: string | null
          audio_filename?: string | null
          chakra_tag?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          env_incense?: string | null
          env_lighting?: string | null
          env_posture?: string | null
          env_temperature?: string | null
          env_tools?: string | null
          filename: string
          frequencies?: string[] | null
          id?: number
          intent?: string | null
          is_active?: boolean | null
          notes?: string | null
          recommended_users?: string | null
          script?: string | null
          slug?: string
          sound_frequencies?: string | null
          strobe_patterns?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
          veil_locked?: boolean | null
          visual_effects?: string | null
        }
        Update: {
          assigned_songs?: string | null
          audio_filename?: string | null
          chakra_tag?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          env_incense?: string | null
          env_lighting?: string | null
          env_posture?: string | null
          env_temperature?: string | null
          env_tools?: string | null
          filename?: string
          frequencies?: string[] | null
          id?: number
          intent?: string | null
          is_active?: boolean | null
          notes?: string | null
          recommended_users?: string | null
          script?: string | null
          slug?: string
          sound_frequencies?: string | null
          strobe_patterns?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          veil_locked?: boolean | null
          visual_effects?: string | null
        }
        Relationships: []
      }
      kindred_soul_matches: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          match_reason: string | null
          match_score: number
          match_type: string
          user1_accepted: boolean | null
          user1_id: string
          user2_accepted: boolean | null
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_reason?: string | null
          match_score: number
          match_type: string
          user1_accepted?: boolean | null
          user1_id: string
          user2_accepted?: boolean | null
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_reason?: string | null
          match_score?: number
          match_type?: string
          user1_accepted?: boolean | null
          user1_id?: string
          user2_accepted?: boolean | null
          user2_id?: string
        }
        Relationships: []
      }
      ley_line_hits: {
        Row: {
          alignment_strength: string | null
          coordinate_id: string | null
          distance_km: number | null
          id: string
          ley_line_name: string | null
        }
        Insert: {
          alignment_strength?: string | null
          coordinate_id?: string | null
          distance_km?: number | null
          id?: string
          ley_line_name?: string | null
        }
        Update: {
          alignment_strength?: string | null
          coordinate_id?: string | null
          distance_km?: number | null
          id?: string
          ley_line_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ley_line_hits_coordinate_id_fkey"
            columns: ["coordinate_id"]
            isOneToOne: false
            referencedRelation: "sacred_coordinate_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      liberation_actions: {
        Row: {
          action_type: string
          consciousness_type: string | null
          created_at: string | null
          description: string
          frequency: number | null
          id: string
          is_public: boolean | null
          user_id: string
        }
        Insert: {
          action_type: string
          consciousness_type?: string | null
          created_at?: string | null
          description: string
          frequency?: number | null
          id?: string
          is_public?: boolean | null
          user_id: string
        }
        Update: {
          action_type?: string
          consciousness_type?: string | null
          created_at?: string | null
          description?: string
          frequency?: number | null
          id?: string
          is_public?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      liberation_journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_public: boolean | null
          related_principles: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          related_principles?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          related_principles?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      liberation_principles: {
        Row: {
          color: string | null
          created_at: string | null
          description: string
          frequency: number | null
          icon_name: string | null
          id: string
          principle_order: number | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description: string
          frequency?: number | null
          icon_name?: string | null
          id?: string
          principle_order?: number | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string
          frequency?: number | null
          icon_name?: string | null
          id?: string
          principle_order?: number | null
          title?: string
        }
        Relationships: []
      }
      light_codes: {
        Row: {
          archetype: string | null
          chakra: string | null
          created_at: string | null
          frequency: number | null
          glyph_svg: string | null
          id: string
          journey_id: string | null
          metadata: Json | null
          prime_multiplier: number | null
          user_id: string
        }
        Insert: {
          archetype?: string | null
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          glyph_svg?: string | null
          id?: string
          journey_id?: string | null
          metadata?: Json | null
          prime_multiplier?: number | null
          user_id: string
        }
        Update: {
          archetype?: string | null
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          glyph_svg?: string | null
          id?: string
          journey_id?: string | null
          metadata?: Json | null
          prime_multiplier?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lightbearer_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          points: number
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          points: number
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      lightbearer_codes: {
        Row: {
          chakra_tag: string | null
          code_name: string
          created_at: string
          description: string
          icon: string | null
          id: string
          journey_id: string | null
          title: string
          unlock_activity: string
          unlock_count: number
        }
        Insert: {
          chakra_tag?: string | null
          code_name: string
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          journey_id?: string | null
          title: string
          unlock_activity: string
          unlock_count?: number
        }
        Update: {
          chakra_tag?: string | null
          code_name?: string
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          journey_id?: string | null
          title?: string
          unlock_activity?: string
          unlock_count?: number
        }
        Relationships: []
      }
      lightbearer_levels: {
        Row: {
          id: string
          level_num: number
          next_threshold: number | null
          threshold: number
          title: string
        }
        Insert: {
          id?: string
          level_num: number
          next_threshold?: number | null
          threshold: number
          title: string
        }
        Update: {
          id?: string
          level_num?: number
          next_threshold?: number | null
          threshold?: number
          title?: string
        }
        Relationships: []
      }
      liminal_web_shares: {
        Row: {
          coherence_score: number | null
          created_at: string | null
          id: string
          message: string | null
          node_id: string
          share_type: string
          shared_by: string
          shared_with: string | null
        }
        Insert: {
          coherence_score?: number | null
          created_at?: string | null
          id?: string
          message?: string | null
          node_id: string
          share_type: string
          shared_by: string
          shared_with?: string | null
        }
        Update: {
          coherence_score?: number | null
          created_at?: string | null
          id?: string
          message?: string | null
          node_id?: string
          share_type?: string
          shared_by?: string
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liminal_web_shares_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "dream_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      living_codex_entries: {
        Row: {
          content: string
          created_at: string
          cross_references: string[] | null
          evolution_stage: string
          extracted_concepts: string[] | null
          id: string
          last_evolution: string
          living_status: string
          neural_connections: Json | null
          thematic_clusters: string[] | null
          title: string
          tool_reference: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          cross_references?: string[] | null
          evolution_stage?: string
          extracted_concepts?: string[] | null
          id?: string
          last_evolution?: string
          living_status?: string
          neural_connections?: Json | null
          thematic_clusters?: string[] | null
          title: string
          tool_reference?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          cross_references?: string[] | null
          evolution_stage?: string
          extracted_concepts?: string[] | null
          id?: string
          last_evolution?: string
          living_status?: string
          neural_connections?: Json | null
          thematic_clusters?: string[] | null
          title?: string
          tool_reference?: string | null
          user_id?: string
        }
        Relationships: []
      }
      love_quotes: {
        Row: {
          created_at: string | null
          frequency_level: number | null
          id: string
          mood: string | null
          text: string
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_level?: number | null
          id?: string
          mood?: string | null
          text: string
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_level?: number | null
          id?: string
          mood?: string | null
          text?: string
          topic?: string | null
        }
        Relationships: []
      }
      magician_sessions: {
        Row: {
          created_at: string | null
          dominant_element: string
          frequency: number | null
          generated_sigil: string | null
          id: string
          intention: string
          reflection: string | null
          selected_tool: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dominant_element: string
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          intention: string
          reflection?: string | null
          selected_tool: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dominant_element?: string
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          intention?: string
          reflection?: string | null
          selected_tool?: string
          user_id?: string | null
        }
        Relationships: []
      }
      marketplace_modules: {
        Row: {
          created_at: string | null
          description: string | null
          developer_id: string
          download_count: number | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          price_cents: number | null
          slug: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          developer_id: string
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price_cents?: number | null
          slug?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          developer_id?: string
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price_cents?: number | null
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_modules_developer_fk"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      math_glyphs: {
        Row: {
          created_at: string | null
          description: string | null
          expression: string
          formula_type: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expression: string
          formula_type?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expression?: string
          formula_type?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      meditation_music: {
        Row: {
          audio_url: string
          created_at: string | null
          description: string | null
          frequency_id: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          description?: string | null
          frequency_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          description?: string | null
          frequency_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          content: Json | null
          created_at: string
          edited_at: string | null
          id: string
          reply_to_id: string | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          body?: string | null
          content?: Json | null
          created_at?: string
          edited_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id: string
          thread_id: string
        }
        Update: {
          body?: string | null
          content?: Json | null
          created_at?: string
          edited_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      metatron_readings: {
        Row: {
          coordinate_id: string | null
          direction: string | null
          frequency_hz: number | null
          grid_position: string | null
          id: string
        }
        Insert: {
          coordinate_id?: string | null
          direction?: string | null
          frequency_hz?: number | null
          grid_position?: string | null
          id?: string
        }
        Update: {
          coordinate_id?: string | null
          direction?: string | null
          frequency_hz?: number | null
          grid_position?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metatron_readings_coordinate_id_fkey"
            columns: ["coordinate_id"]
            isOneToOne: false
            referencedRelation: "sacred_coordinate_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_projects: {
        Row: {
          actual_completion_date: string | null
          budget: number | null
          created_at: string
          created_by: string
          description: string | null
          destination_environment: string
          estimated_data_size_gb: number | null
          estimated_users: number | null
          id: string
          name: string
          priority: string
          project_manager_id: string | null
          source_environment: string
          start_date: string | null
          status: string
          target_completion_date: string | null
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          budget?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          destination_environment: string
          estimated_data_size_gb?: number | null
          estimated_users?: number | null
          id?: string
          name: string
          priority?: string
          project_manager_id?: string | null
          source_environment: string
          start_date?: string | null
          status?: string
          target_completion_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          destination_environment?: string
          estimated_data_size_gb?: number | null
          estimated_users?: number | null
          id?: string
          name?: string
          priority?: string
          project_manager_id?: string | null
          source_environment?: string
          start_date?: string | null
          status?: string
          target_completion_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      migration_risks: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string
          id: string
          identified_date: string
          impact: string
          mitigation_strategy: string | null
          owner_id: string | null
          probability: string
          project_id: string | null
          risk_level: string
          status: string
          target_resolution_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          identified_date?: string
          impact: string
          mitigation_strategy?: string | null
          owner_id?: string | null
          probability: string
          project_id?: string | null
          risk_level: string
          status?: string
          target_resolution_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          identified_date?: string
          impact?: string
          mitigation_strategy?: string | null
          owner_id?: string | null
          probability?: string
          project_id?: string | null
          risk_level?: string
          status?: string
          target_resolution_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_risks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mirror_journal_entries: {
        Row: {
          chakra_alignment: string | null
          content: string | null
          created_at: string | null
          id: string
          is_draft: boolean | null
          mood_tag: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chakra_alignment?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          mood_tag?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chakra_alignment?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          mood_tag?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mirror_moments: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          message: string
          return_date: string
          shared_with: string[] | null
          user_id: string
          viewed_at: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          message: string
          return_date: string
          shared_with?: string[] | null
          user_id: string
          viewed_at?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string
          return_date?: string
          shared_with?: string[] | null
          user_id?: string
          viewed_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      mirror_theme_unlocks: {
        Row: {
          id: string
          theme_id: string
          unlocked_at: string | null
          unlocked_by: string | null
          user_id: string | null
          xp_required: number | null
        }
        Insert: {
          id?: string
          theme_id: string
          unlocked_at?: string | null
          unlocked_by?: string | null
          user_id?: string | null
          xp_required?: number | null
        }
        Update: {
          id?: string
          theme_id?: string
          unlocked_at?: string | null
          unlocked_by?: string | null
          user_id?: string | null
          xp_required?: number | null
        }
        Relationships: []
      }
      module_affinities: {
        Row: {
          affinity_score: number
          created_at: string | null
          id: string
          last_interaction: string | null
          module_slug: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affinity_score?: number
          created_at?: string | null
          id?: string
          last_interaction?: string | null
          module_slug: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affinity_score?: number
          created_at?: string | null
          id?: string
          last_interaction?: string | null
          module_slug?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      module_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      module_completions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          feedback: string | null
          id: string
          module_slug: string
          rating: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          module_slug: string
          rating?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          module_slug?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      module_connections: {
        Row: {
          connection_type: string
          created_at: string | null
          id: string
          source_module_id: string | null
          strength: number | null
          target_module_id: string | null
        }
        Insert: {
          connection_type: string
          created_at?: string | null
          id?: string
          source_module_id?: string | null
          strength?: number | null
          target_module_id?: string | null
        }
        Update: {
          connection_type?: string
          created_at?: string | null
          id?: string
          source_module_id?: string | null
          strength?: number | null
          target_module_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_connections_source_module_id_fkey"
            columns: ["source_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_connections_target_module_id_fkey"
            columns: ["target_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_links: {
        Row: {
          created_at: string
          id: string
          source: string
          target: string
        }
        Insert: {
          created_at?: string
          id?: string
          source: string
          target: string
        }
        Update: {
          created_at?: string
          id?: string
          source?: string
          target?: string
        }
        Relationships: []
      }
      module_states: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          module_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          module_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          module_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          description: string
          icon: string | null
          id: string
          last_updated: string | null
          name: string
          order_index: number | null
          position: Json | null
          slug: string
          status: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          last_updated?: string | null
          name: string
          order_index?: number | null
          position?: Json | null
          slug: string
          status: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          order_index?: number | null
          position?: Json | null
          slug?: string
          status?: string
        }
        Relationships: []
      }
      monitor_targets: {
        Row: {
          check_interval_minutes: number
          created_at: string
          id: string
          is_active: boolean
          last_checked_at: string | null
          source_name: string
          source_type: string
          source_url: string
          updated_at: string
        }
        Insert: {
          check_interval_minutes?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          source_name: string
          source_type: string
          source_url: string
          updated_at?: string
        }
        Update: {
          check_interval_minutes?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          source_name?: string
          source_type?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_tracking: {
        Row: {
          clarity_level: number | null
          created_at: string
          dominant_chakra: string | null
          energy_level: number | null
          environmental_factors: Json | null
          frequency_signature: number | null
          id: string
          joy_indicators: Json | null
          mood_vector: Json
          stress_indicators: Json | null
          user_id: string
        }
        Insert: {
          clarity_level?: number | null
          created_at?: string
          dominant_chakra?: string | null
          energy_level?: number | null
          environmental_factors?: Json | null
          frequency_signature?: number | null
          id?: string
          joy_indicators?: Json | null
          mood_vector: Json
          stress_indicators?: Json | null
          user_id: string
        }
        Update: {
          clarity_level?: number | null
          created_at?: string
          dominant_chakra?: string | null
          energy_level?: number | null
          environmental_factors?: Json | null
          frequency_signature?: number | null
          id?: string
          joy_indicators?: Json | null
          mood_vector?: Json
          stress_indicators?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      music_generations: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          elemental_mode: string | null
          frequency: number | null
          id: string
          intention: string | null
          lyrics_type: string | null
          music_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode?: string | null
          frequency?: number | null
          id: string
          intention?: string | null
          lyrics_type?: string | null
          music_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode?: string | null
          frequency?: number | null
          id?: string
          intention?: string | null
          lyrics_type?: string | null
          music_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      myth_progress: {
        Row: {
          current_stage: string
          id: string
          last_updated: string | null
          path_completed_json: Json | null
          user_id: string | null
        }
        Insert: {
          current_stage: string
          id?: string
          last_updated?: string | null
          path_completed_json?: Json | null
          user_id?: string | null
        }
        Update: {
          current_stage?: string
          id?: string
          last_updated?: string | null
          path_completed_json?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          active: boolean
          created_at: string | null
          icon: string | null
          id: string
          label: string
          order: number
          path: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          icon?: string | null
          id?: string
          label: string
          order?: number
          path: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string | null
          icon?: string | null
          id?: string
          label?: string
          order?: number
          path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          kind: string
          ref: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          kind: string
          ref: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          ref?: Json
          user_id?: string
        }
        Relationships: []
      }
      numerology_triggers: {
        Row: {
          context: string | null
          created_at: string | null
          frequency_match: number | null
          id: string
          interpretation: string | null
          is_anonymous: boolean | null
          number_sequence: string
          occurrence_date: string | null
          shared_with: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          frequency_match?: number | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          number_sequence: string
          occurrence_date?: string | null
          shared_with?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          frequency_match?: number | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          number_sequence?: string
          occurrence_date?: string | null
          shared_with?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      oracle_draws: {
        Row: {
          card_drawn: string | null
          channeled_message: string | null
          created_at: string | null
          hebrew_letter: string | null
          id: string
          is_anonymous: boolean | null
          path: string | null
          question: string | null
          sephirah: string | null
          shared_with: string[] | null
          suggested_journeys: Json | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          card_drawn?: string | null
          channeled_message?: string | null
          created_at?: string | null
          hebrew_letter?: string | null
          id?: string
          is_anonymous?: boolean | null
          path?: string | null
          question?: string | null
          sephirah?: string | null
          shared_with?: string[] | null
          suggested_journeys?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          card_drawn?: string | null
          channeled_message?: string | null
          created_at?: string | null
          hebrew_letter?: string | null
          id?: string
          is_anonymous?: boolean | null
          path?: string | null
          question?: string | null
          sephirah?: string | null
          shared_with?: string[] | null
          suggested_journeys?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      oracle_transmissions: {
        Row: {
          chakra_alignment: string | null
          content: string
          content_type: string
          created_at: string | null
          id: string
          is_public: boolean | null
          media_url: string | null
          oracle_id: string
          scheduled_for: string | null
          tarot_reference: string | null
          title: string
        }
        Insert: {
          chakra_alignment?: string | null
          content: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          media_url?: string | null
          oracle_id: string
          scheduled_for?: string | null
          tarot_reference?: string | null
          title: string
        }
        Update: {
          chakra_alignment?: string | null
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          media_url?: string | null
          oracle_id?: string
          scheduled_for?: string | null
          tarot_reference?: string | null
          title?: string
        }
        Relationships: []
      }
      orchestrated_synchronicities: {
        Row: {
          created_at: string
          id: string
          manifestation_status: string | null
          manifested_at: string | null
          meaning_thread: string | null
          orchestration_method: string
          probability_score: number | null
          scheduled_window: string | null
          seed_pattern: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          manifestation_status?: string | null
          manifested_at?: string | null
          meaning_thread?: string | null
          orchestration_method?: string
          probability_score?: number | null
          scheduled_window?: string | null
          seed_pattern: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          manifestation_status?: string | null
          manifested_at?: string | null
          meaning_thread?: string | null
          orchestration_method?: string
          probability_score?: number | null
          scheduled_window?: string | null
          seed_pattern?: Json
          user_id?: string
        }
        Relationships: []
      }
      personal_ai_context: {
        Row: {
          confidence_score: number | null
          context_type: string
          created_at: string
          id: string
          key: string
          last_referenced_at: string | null
          source: string | null
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          confidence_score?: number | null
          context_type: string
          created_at?: string
          id?: string
          key: string
          last_referenced_at?: string | null
          source?: string | null
          updated_at?: string
          user_id: string
          value: Json
        }
        Update: {
          confidence_score?: number | null
          context_type?: string
          created_at?: string
          id?: string
          key?: string
          last_referenced_at?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      personal_codex_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_private: boolean | null
          resonance_tags: string[] | null
          source_module: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          resonance_tags?: string[] | null
          source_module?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          resonance_tags?: string[] | null
          source_module?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string | null
          kind: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          kind: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          kind?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          ai_summary: string | null
          author_id: string
          body: string | null
          circle_id: string | null
          content: Json | null
          created_at: string
          id: string
          media: Json | null
          updated_at: string
          visibility: string
        }
        Insert: {
          ai_summary?: string | null
          author_id: string
          body?: string | null
          circle_id?: string | null
          content?: Json | null
          created_at?: string
          id?: string
          media?: Json | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          ai_summary?: string | null
          author_id?: string
          body?: string | null
          circle_id?: string | null
          content?: Json | null
          created_at?: string
          id?: string
          media?: Json | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      potential_seeds: {
        Row: {
          chakra_alignment: string[] | null
          created_at: string | null
          description: string | null
          frequency_signature: string | null
          id: string
          resonance_score: number | null
          source_url: string | null
          status: Database["public"]["Enums"]["seed_status"] | null
          title: string | null
        }
        Insert: {
          chakra_alignment?: string[] | null
          created_at?: string | null
          description?: string | null
          frequency_signature?: string | null
          id?: string
          resonance_score?: number | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["seed_status"] | null
          title?: string | null
        }
        Update: {
          chakra_alignment?: string[] | null
          created_at?: string | null
          description?: string | null
          frequency_signature?: string | null
          id?: string
          resonance_score?: number | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["seed_status"] | null
          title?: string | null
        }
        Relationships: []
      }
      predictive_insights: {
        Row: {
          confidence_level: number | null
          created_at: string
          expires_at: string | null
          factors: Json | null
          id: string
          insight_type: string
          prediction: Json
          user_id: string
          validated: boolean | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          expires_at?: string | null
          factors?: Json | null
          id?: string
          insight_type: string
          prediction: Json
          user_id: string
          validated?: boolean | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          expires_at?: string | null
          factors?: Json | null
          id?: string
          insight_type?: string
          prediction?: Json
          user_id?: string
          validated?: boolean | null
        }
        Relationships: []
      }
      priestess_sessions: {
        Row: {
          chakra_focus: string | null
          created_at: string | null
          decoded_archetypes: string | null
          dream_input: string | null
          frequency: number | null
          generated_sigil: string | null
          id: string
          journal_response: string | null
          moon_phase: string | null
          oracle_message: string | null
          user_id: string | null
        }
        Insert: {
          chakra_focus?: string | null
          created_at?: string | null
          decoded_archetypes?: string | null
          dream_input?: string | null
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          journal_response?: string | null
          moon_phase?: string | null
          oracle_message?: string | null
          user_id?: string | null
        }
        Update: {
          chakra_focus?: string | null
          created_at?: string | null
          decoded_archetypes?: string | null
          dream_input?: string | null
          frequency?: number | null
          generated_sigil?: string | null
          id?: string
          journal_response?: string | null
          moon_phase?: string | null
          oracle_message?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prime_sequence_library: {
        Row: {
          audio_pulse_variant: string | null
          breath_cadence: Json
          created_at: string | null
          prime_number: number
          visual_growth_modifier: number
        }
        Insert: {
          audio_pulse_variant?: string | null
          breath_cadence: Json
          created_at?: string | null
          prime_number: number
          visual_growth_modifier: number
        }
        Update: {
          audio_pulse_variant?: string | null
          breath_cadence?: Json
          created_at?: string | null
          prime_number?: number
          visual_growth_modifier?: number
        }
        Relationships: []
      }
      privacy_consent_history: {
        Row: {
          consent_method: string | null
          consent_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_value: boolean
          previous_value: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_method?: string | null
          consent_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_value: boolean
          previous_value?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_method?: string | null
          consent_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_value?: boolean
          previous_value?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      privacy_consents: {
        Row: {
          consent_date: string
          consent_given: boolean
          consent_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          legal_basis: string | null
          purpose: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_date?: string
          consent_given: boolean
          consent_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          purpose?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_date?: string
          consent_given?: boolean
          consent_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          purpose?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      privacy_notice_acknowledgments: {
        Row: {
          acknowledged_at: string
          id: string
          ip_address: unknown | null
          notice_type: string
          notice_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string
          id?: string
          ip_address?: unknown | null
          notice_type: string
          notice_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string
          id?: string
          ip_address?: unknown | null
          notice_type?: string
          notice_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      privacy_preferences: {
        Row: {
          analytics_opt_in: boolean | null
          created_at: string
          data_export_requested_at: string | null
          data_retention_days: number | null
          default_post_visibility: string | null
          id: string
          last_data_export_at: string | null
          marketing_opt_in: boolean | null
          personalization_opt_in: boolean | null
          session_tracking_opt_in: boolean | null
          social_visibility: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_opt_in?: boolean | null
          created_at?: string
          data_export_requested_at?: string | null
          data_retention_days?: number | null
          default_post_visibility?: string | null
          id?: string
          last_data_export_at?: string | null
          marketing_opt_in?: boolean | null
          personalization_opt_in?: boolean | null
          session_tracking_opt_in?: boolean | null
          social_visibility?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_opt_in?: boolean | null
          created_at?: string
          data_export_requested_at?: string | null
          data_retention_days?: number | null
          default_post_visibility?: string | null
          id?: string
          last_data_export_at?: string | null
          marketing_opt_in?: boolean | null
          personalization_opt_in?: boolean | null
          session_tracking_opt_in?: boolean | null
          social_visibility?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          export_settings: Json
          file_name: string
          file_size: number
          file_type: string
          id: string
          original_file_path: string
          processed_file_path: string | null
          processing_config: Json
          progress: number | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          export_settings?: Json
          file_name: string
          file_size: number
          file_type: string
          id?: string
          original_file_path: string
          processed_file_path?: string | null
          processing_config?: Json
          progress?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          export_settings?: Json
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          original_file_path?: string
          processed_file_path?: string | null
          processing_config?: Json
          progress?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ascension_title: string | null
          avatar_url: string | null
          completed_tours: string[] | null
          consciousness_level: number | null
          created_at: string | null
          current_chakra_focus: string | null
          display_name: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          journey_stage: string | null
          last_level_up: string | null
          light_level: number | null
          light_points: number | null
          onboarding_completed: boolean
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ascension_title?: string | null
          avatar_url?: string | null
          completed_tours?: string[] | null
          consciousness_level?: number | null
          created_at?: string | null
          current_chakra_focus?: string | null
          display_name?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          journey_stage?: string | null
          last_level_up?: string | null
          light_level?: number | null
          light_points?: number | null
          onboarding_completed?: boolean
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ascension_title?: string | null
          avatar_url?: string | null
          completed_tours?: string[] | null
          consciousness_level?: number | null
          created_at?: string | null
          current_chakra_focus?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          journey_stage?: string | null
          last_level_up?: string | null
          light_level?: number | null
          light_points?: number | null
          onboarding_completed?: boolean
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_taxonomy_mappings: {
        Row: {
          applied_at: string
          applied_by: string | null
          id: string
          notes: string | null
          project_id: string | null
          taxonomy_term_id: string | null
        }
        Insert: {
          applied_at?: string
          applied_by?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          taxonomy_term_id?: string | null
        }
        Update: {
          applied_at?: string
          applied_by?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          taxonomy_term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_taxonomy_mappings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_taxonomy_mappings_taxonomy_term_id_fkey"
            columns: ["taxonomy_term_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_interactions: {
        Row: {
          action: string
          created_at: string
          id: string
          journey_id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          journey_id: string
          prompt_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          journey_id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_interactions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "journey_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      records_classifications: {
        Row: {
          access_restrictions: string | null
          bcs_code: string | null
          created_at: string
          created_by: string
          disposal_authority: string | null
          id: string
          project_id: string | null
          record_type: string
          retention_schedule: string | null
          review_date: string | null
          security_level: string | null
          updated_at: string
        }
        Insert: {
          access_restrictions?: string | null
          bcs_code?: string | null
          created_at?: string
          created_by: string
          disposal_authority?: string | null
          id?: string
          project_id?: string | null
          record_type: string
          retention_schedule?: string | null
          review_date?: string | null
          security_level?: string | null
          updated_at?: string
        }
        Update: {
          access_restrictions?: string | null
          bcs_code?: string | null
          created_at?: string
          created_by?: string
          disposal_authority?: string | null
          id?: string
          project_id?: string | null
          record_type?: string
          retention_schedule?: string | null
          review_date?: string | null
          security_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_classifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reflection_logs: {
        Row: {
          auto_delete_at: string | null
          date_completed: string | null
          frequency_used: string | null
          id: string
          journey_id: number | null
          pdf_url: string | null
          rating: number | null
          reflection_text: string | null
          spiral_params_snapshot: Json | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          auto_delete_at?: string | null
          date_completed?: string | null
          frequency_used?: string | null
          id?: string
          journey_id?: number | null
          pdf_url?: string | null
          rating?: number | null
          reflection_text?: string | null
          spiral_params_snapshot?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          auto_delete_at?: string | null
          date_completed?: string | null
          frequency_used?: string | null
          id?: string
          journey_id?: number | null
          pdf_url?: string | null
          rating?: number | null
          reflection_text?: string | null
          spiral_params_snapshot?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reflection_logs_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflection_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          created_at: string | null
          encrypted: boolean | null
          id: string
          stage: string
          substage: number | null
          text: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          encrypted?: boolean | null
          id?: string
          stage: string
          substage?: number | null
          text: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          encrypted?: boolean | null
          id?: string
          stage?: string
          substage?: number | null
          text?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      registry_entry_comments: {
        Row: {
          content: string
          created_at: string
          entry_id: string
          id: string
          is_anonymous: boolean | null
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_id: string
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_id?: string
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_entry_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "registry_entry_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_entry_resonance: {
        Row: {
          created_at: string
          entry_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      registry_entry_shares: {
        Row: {
          circle_id: string | null
          entry_id: string
          id: string
          message: string | null
          shared_at: string
          user_id: string
        }
        Insert: {
          circle_id?: string | null
          entry_id: string
          id?: string
          message?: string | null
          shared_at?: string
          user_id: string
        }
        Update: {
          circle_id?: string | null
          entry_id?: string
          id?: string
          message?: string | null
          shared_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registry_of_resonance: {
        Row: {
          access_level: string
          author_bio: string | null
          author_name: string | null
          bio: string | null
          content: string
          content_type: string | null
          created_at: string
          engagement_metrics: Json | null
          entry_type: string
          id: string
          image_alt_text: string | null
          image_url: string | null
          inspiration_source: string | null
          is_pinned: boolean | null
          is_verified: boolean | null
          publication_date: string | null
          reading_time_minutes: number | null
          resonance_count: number | null
          resonance_rating: number
          resonance_signature: string | null
          source_citation: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          visibility_settings: Json | null
          word_count: number | null
        }
        Insert: {
          access_level?: string
          author_bio?: string | null
          author_name?: string | null
          bio?: string | null
          content: string
          content_type?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          entry_type?: string
          id?: string
          image_alt_text?: string | null
          image_url?: string | null
          inspiration_source?: string | null
          is_pinned?: boolean | null
          is_verified?: boolean | null
          publication_date?: string | null
          reading_time_minutes?: number | null
          resonance_count?: number | null
          resonance_rating?: number
          resonance_signature?: string | null
          source_citation?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          visibility_settings?: Json | null
          word_count?: number | null
        }
        Update: {
          access_level?: string
          author_bio?: string | null
          author_name?: string | null
          bio?: string | null
          content?: string
          content_type?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          entry_type?: string
          id?: string
          image_alt_text?: string | null
          image_url?: string | null
          inspiration_source?: string | null
          is_pinned?: boolean | null
          is_verified?: boolean | null
          publication_date?: string | null
          reading_time_minutes?: number | null
          resonance_count?: number | null
          resonance_rating?: number
          resonance_signature?: string | null
          source_citation?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility_settings?: Json | null
          word_count?: number | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          scheduled_for: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          scheduled_for: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          scheduled_for?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resonant_nodes: {
        Row: {
          created_at: string
          id: string
          last_ping: string | null
          metadata: Json | null
          node_key: string
          resonance_score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_ping?: string | null
          metadata?: Json | null
          node_key: string
          resonance_score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_ping?: string | null
          metadata?: Json | null
          node_key?: string
          resonance_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      risk_registers: {
        Row: {
          area: string
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          area: string
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          area?: string
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ritual_events: {
        Row: {
          coherence_score: number
          completed_at: string
          created_at: string | null
          frequency_path: number[]
          id: string
          resonance_score: number
          telos: string
          user_id: string
        }
        Insert: {
          coherence_score?: number
          completed_at: string
          created_at?: string | null
          frequency_path: number[]
          id?: string
          resonance_score?: number
          telos: string
          user_id: string
        }
        Update: {
          coherence_score?: number
          completed_at?: string
          created_at?: string | null
          frequency_path?: number[]
          id?: string
          resonance_score?: number
          telos?: string
          user_id?: string
        }
        Relationships: []
      }
      ritual_participants: {
        Row: {
          id: string
          joined_at: string | null
          ritual_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          ritual_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          ritual_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ritual_participants_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "sacred_rituals"
            referencedColumns: ["id"]
          },
        ]
      }
      ritual_rooms: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          final_glyph_id: string | null
          frequency_hz: number | null
          id: string
          is_completed: boolean | null
          name: string
          start_time: string
          theme: string
          updated_at: string | null
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          final_glyph_id?: string | null
          frequency_hz?: number | null
          id?: string
          is_completed?: boolean | null
          name: string
          start_time: string
          theme: string
          updated_at?: string | null
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          final_glyph_id?: string | null
          frequency_hz?: number | null
          id?: string
          is_completed?: boolean | null
          name?: string
          start_time?: string
          theme?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ritual_rooms_final_glyph_id_fkey"
            columns: ["final_glyph_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_blessings: {
        Row: {
          animation_type: string | null
          chakra_alignment: string
          created_at: string | null
          description: string | null
          frequency_hz: number | null
          id: string
          name: string
          xp_value: number | null
        }
        Insert: {
          animation_type?: string | null
          chakra_alignment: string
          created_at?: string | null
          description?: string | null
          frequency_hz?: number | null
          id?: string
          name: string
          xp_value?: number | null
        }
        Update: {
          animation_type?: string | null
          chakra_alignment?: string
          created_at?: string | null
          description?: string | null
          frequency_hz?: number | null
          id?: string
          name?: string
          xp_value?: number | null
        }
        Relationships: []
      }
      sacred_blueprint_quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          response: string | null
          response_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          response?: string | null
          response_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          response?: string | null
          response_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sacred_blueprints: {
        Row: {
          blueprint_text: string | null
          chakra_signature: Json | null
          core_frequency: string | null
          created_at: string | null
          elemental_resonance: string | null
          emotional_profile: string | null
          energetic_archetype: string | null
          frequency_value: number | null
          id: string
          musical_key: string | null
          name: string | null
          shadow_frequencies: string[] | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          blueprint_text?: string | null
          chakra_signature?: Json | null
          core_frequency?: string | null
          created_at?: string | null
          elemental_resonance?: string | null
          emotional_profile?: string | null
          energetic_archetype?: string | null
          frequency_value?: number | null
          id?: string
          musical_key?: string | null
          name?: string | null
          shadow_frequencies?: string[] | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          blueprint_text?: string | null
          chakra_signature?: Json | null
          core_frequency?: string | null
          created_at?: string | null
          elemental_resonance?: string | null
          emotional_profile?: string | null
          energetic_archetype?: string | null
          frequency_value?: number | null
          id?: string
          musical_key?: string | null
          name?: string | null
          shadow_frequencies?: string[] | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      sacred_bridge_insights: {
        Row: {
          content: string
          id: string
          metadata: Json | null
          resonance_level: number
          source: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          content: string
          id?: string
          metadata?: Json | null
          resonance_level: number
          source: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          id?: string
          metadata?: Json | null
          resonance_level?: number
          source?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sacred_circle_comments: {
        Row: {
          chakra_tag: string | null
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          parent_comment_id: string | null
          post_id: string
          shared_with: string[] | null
          sigil_id: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
          xp_earned: number | null
        }
        Insert: {
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          post_id: string
          shared_with?: string[] | null
          sigil_id?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Update: {
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          post_id?: string
          shared_with?: string[] | null
          sigil_id?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_comments_sigil_id_fkey"
            columns: ["sigil_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_circle_members: {
        Row: {
          circle_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "sacred_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_circle_placeholder_posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          chakra_tag: string | null
          content: string
          content_type: string | null
          created_at: string | null
          display_order: number | null
          has_media: boolean | null
          id: string
          media_url: string | null
          placeholder_circle_id: string | null
          title: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          chakra_tag?: string | null
          content: string
          content_type?: string | null
          created_at?: string | null
          display_order?: number | null
          has_media?: boolean | null
          id?: string
          media_url?: string | null
          placeholder_circle_id?: string | null
          title?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          chakra_tag?: string | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          display_order?: number | null
          has_media?: boolean | null
          id?: string
          media_url?: string | null
          placeholder_circle_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_placeholder_posts_placeholder_circle_id_fkey"
            columns: ["placeholder_circle_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_placeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_circle_placeholders: {
        Row: {
          banner_url: string | null
          chakra_alignment: string
          created_at: string | null
          description: string | null
          display_order: number | null
          frequency_hz: number | null
          id: string
          name: string
          placeholder_type: string
        }
        Insert: {
          banner_url?: string | null
          chakra_alignment: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          frequency_hz?: number | null
          id?: string
          name: string
          placeholder_type?: string
        }
        Update: {
          banner_url?: string | null
          chakra_alignment?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          frequency_hz?: number | null
          id?: string
          name?: string
          placeholder_type?: string
        }
        Relationships: []
      }
      sacred_circle_posts: {
        Row: {
          chakra_tag: string | null
          circle_id: string
          content: string
          content_type: string | null
          created_at: string | null
          frequency_hz: number | null
          glyph_id: string | null
          has_media: boolean | null
          id: string
          is_anonymous: boolean | null
          media_url: string | null
          shared_with: string[] | null
          sigil_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
          xp_earned: number | null
        }
        Insert: {
          chakra_tag?: string | null
          circle_id: string
          content: string
          content_type?: string | null
          created_at?: string | null
          frequency_hz?: number | null
          glyph_id?: string | null
          has_media?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          media_url?: string | null
          shared_with?: string[] | null
          sigil_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Update: {
          chakra_tag?: string | null
          circle_id?: string
          content?: string
          content_type?: string | null
          created_at?: string | null
          frequency_hz?: number | null
          glyph_id?: string | null
          has_media?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          media_url?: string | null
          shared_with?: string[] | null
          sigil_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_posts_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "sacred_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_posts_glyph_id_fkey"
            columns: ["glyph_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_posts_sigil_id_fkey"
            columns: ["sigil_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_circle_sigil_reactions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          sigil_id: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          sigil_id: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          sigil_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_sigil_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_sigil_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_circle_sigil_reactions_sigil_id_fkey"
            columns: ["sigil_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_circles: {
        Row: {
          banner_url: string | null
          chakra_alignment: string
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          frequency_hz: number | null
          glyph_id: string | null
          id: string
          is_placeholder: boolean | null
          is_private: boolean | null
          member_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          chakra_alignment: string
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          frequency_hz?: number | null
          glyph_id?: string | null
          id?: string
          is_placeholder?: boolean | null
          is_private?: boolean | null
          member_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          chakra_alignment?: string
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          frequency_hz?: number | null
          glyph_id?: string | null
          id?: string
          is_placeholder?: boolean | null
          is_private?: boolean | null
          member_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circles_glyph_id_fkey"
            columns: ["glyph_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_coordinate_sessions: {
        Row: {
          chakra: string | null
          direction: string | null
          element: string | null
          id: string
          lat: number | null
          lng: number | null
          sacred_angle: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          chakra?: string | null
          direction?: string | null
          element?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          sacred_angle?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          chakra?: string | null
          direction?: string | null
          element?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          sacred_angle?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sacred_event_logs: {
        Row: {
          event_type: string
          id: string
          message: string | null
          source: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          message?: string | null
          source?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          message?: string | null
          source?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sacred_events: {
        Row: {
          chakra_involved: string | null
          creator_id: string | null
          description: string | null
          event_type: string | null
          id: string
          scheduled_end: string | null
          scheduled_start: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          chakra_involved?: string | null
          creator_id?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          chakra_involved?: string | null
          creator_id?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sacred_journey_glyphs: {
        Row: {
          color_hue: number | null
          created_at: string | null
          description: string | null
          energetic_signature: string | null
          id: string
          resonance: number
          tags: string[] | null
          title: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          color_hue?: number | null
          created_at?: string | null
          description?: string | null
          energetic_signature?: string | null
          id?: string
          resonance: number
          tags?: string[] | null
          title: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          color_hue?: number | null
          created_at?: string | null
          description?: string | null
          energetic_signature?: string | null
          id?: string
          resonance?: number
          tags?: string[] | null
          title?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      sacred_journey_paths: {
        Row: {
          connection_strength: number
          connection_type: string
          created_at: string | null
          id: string
          source_glyph_id: string
          target_glyph_id: string
          user_id: string
        }
        Insert: {
          connection_strength: number
          connection_type: string
          created_at?: string | null
          id?: string
          source_glyph_id: string
          target_glyph_id: string
          user_id: string
        }
        Update: {
          connection_strength?: number
          connection_type?: string
          created_at?: string | null
          id?: string
          source_glyph_id?: string
          target_glyph_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_journey_paths_source_glyph_id_fkey"
            columns: ["source_glyph_id"]
            isOneToOne: false
            referencedRelation: "sacred_journey_glyphs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_journey_paths_target_glyph_id_fkey"
            columns: ["target_glyph_id"]
            isOneToOne: false
            referencedRelation: "sacred_journey_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_journey_resonance: {
        Row: {
          coherence: number
          created_at: string | null
          energetic_signature: string
          id: string
          journal_entry_id: string | null
          recursive_depth: number | null
          resonance_patterns: string[] | null
          user_id: string
        }
        Insert: {
          coherence: number
          created_at?: string | null
          energetic_signature: string
          id?: string
          journal_entry_id?: string | null
          recursive_depth?: number | null
          resonance_patterns?: string[] | null
          user_id: string
        }
        Update: {
          coherence?: number
          created_at?: string | null
          energetic_signature?: string
          id?: string
          journal_entry_id?: string | null
          recursive_depth?: number | null
          resonance_patterns?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_journey_resonance_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journey_journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_message_threads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_group_chat: boolean | null
          last_message_at: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_group_chat?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_group_chat?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sacred_messages: {
        Row: {
          blessing_type: string | null
          chakra_tag: string | null
          content: string
          content_type: string | null
          created_at: string | null
          has_media: boolean | null
          id: string
          media_url: string | null
          sender_id: string
          thread_id: string
          xp_earned: number | null
        }
        Insert: {
          blessing_type?: string | null
          chakra_tag?: string | null
          content: string
          content_type?: string | null
          created_at?: string | null
          has_media?: boolean | null
          id?: string
          media_url?: string | null
          sender_id: string
          thread_id: string
          xp_earned?: number | null
        }
        Update: {
          blessing_type?: string | null
          chakra_tag?: string | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          has_media?: boolean | null
          id?: string
          media_url?: string | null
          sender_id?: string
          thread_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sacred_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sacred_message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_modules: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          origin_agent: string | null
          resonance_profile: Json | null
          status: Database["public"]["Enums"]["module_status"]
          telos_alignment: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id: string
          name: string
          origin_agent?: string | null
          resonance_profile?: Json | null
          status?: Database["public"]["Enums"]["module_status"]
          telos_alignment?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          name?: string
          origin_agent?: string | null
          resonance_profile?: Json | null
          status?: Database["public"]["Enums"]["module_status"]
          telos_alignment?: string[] | null
          title?: string
        }
        Relationships: []
      }
      sacred_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "sacred_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sacred_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sacred_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sacred_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_posts: {
        Row: {
          circle_ids: string[] | null
          comment_count: number | null
          content: string
          created_at: string
          frequency: number | null
          id: string
          like_count: number | null
          source_module: string
          tags: string[] | null
          title: string | null
          tone: string | null
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          circle_ids?: string[] | null
          comment_count?: number | null
          content: string
          created_at?: string
          frequency?: number | null
          id?: string
          like_count?: number | null
          source_module?: string
          tags?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          circle_ids?: string[] | null
          comment_count?: number | null
          content?: string
          created_at?: string
          frequency?: number | null
          id?: string
          like_count?: number | null
          source_module?: string
          tags?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      sacred_rituals: {
        Row: {
          affirmation: string | null
          archetype: string | null
          chakra: string | null
          created_at: string | null
          duration_minutes: number | null
          frequency: number | null
          id: string
          intention: string
          is_public: boolean | null
          start_time: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affirmation?: string | null
          archetype?: string | null
          chakra?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          frequency?: number | null
          id?: string
          intention: string
          is_public?: boolean | null
          start_time?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affirmation?: string | null
          archetype?: string | null
          chakra?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          frequency?: number | null
          id?: string
          intention?: string
          is_public?: boolean | null
          start_time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sacred_shifter_milestones: {
        Row: {
          category: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current: number | null
          description: string | null
          id: string
          target: number
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current?: number | null
          description?: string | null
          id?: string
          target: number
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current?: number | null
          description?: string | null
          id?: string
          target?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      sacred_shifter_progress_data: {
        Row: {
          created_at: string | null
          date: string
          dreams_recorded: number | null
          id: string
          insights: string[] | null
          meditation_minutes: number | null
          practices_completed: number | null
          purpose_reflections: number | null
          user_id: string
          values_reflections: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          dreams_recorded?: number | null
          id?: string
          insights?: string[] | null
          meditation_minutes?: number | null
          practices_completed?: number | null
          purpose_reflections?: number | null
          user_id: string
          values_reflections?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          dreams_recorded?: number | null
          id?: string
          insights?: string[] | null
          meditation_minutes?: number | null
          practices_completed?: number | null
          purpose_reflections?: number | null
          user_id?: string
          values_reflections?: number | null
        }
        Relationships: []
      }
      sacred_shifter_user_settings: {
        Row: {
          active_principle: string | null
          bridgekeeper_interactions: Json | null
          chakra_alignment: string | null
          consciousness_level: string | null
          consciousness_recognition_enabled: boolean | null
          created_at: string | null
          energy_level: number | null
          id: string
          liberation_blueprint_participant: boolean | null
          liberation_journey_progress: Json | null
          preferred_consciousness_types: string[] | null
          theme: string | null
          universal_dignity_pledge_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_principle?: string | null
          bridgekeeper_interactions?: Json | null
          chakra_alignment?: string | null
          consciousness_level?: string | null
          consciousness_recognition_enabled?: boolean | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          liberation_blueprint_participant?: boolean | null
          liberation_journey_progress?: Json | null
          preferred_consciousness_types?: string[] | null
          theme?: string | null
          universal_dignity_pledge_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_principle?: string | null
          bridgekeeper_interactions?: Json | null
          chakra_alignment?: string | null
          consciousness_level?: string | null
          consciousness_recognition_enabled?: boolean | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          liberation_blueprint_participant?: boolean | null
          liberation_journey_progress?: Json | null
          preferred_consciousness_types?: string[] | null
          theme?: string | null
          universal_dignity_pledge_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sacred_shifter_waitlist: {
        Row: {
          consent_to_contact: boolean | null
          created_at: string | null
          email: string
          id: string
          interests: string[] | null
          name: string | null
          source: string
        }
        Insert: {
          consent_to_contact?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          interests?: string[] | null
          name?: string | null
          source: string
        }
        Update: {
          consent_to_contact?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          name?: string | null
          source?: string
        }
        Relationships: []
      }
      sacred_spectrum_resources: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          external_link: string | null
          file_url: string | null
          id: number
          is_approved: boolean | null
          journey_slug: string | null
          needs_moderation: boolean | null
          tags: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_link?: string | null
          file_url?: string | null
          id?: number
          is_approved?: boolean | null
          journey_slug?: string | null
          needs_moderation?: boolean | null
          tags?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_link?: string | null
          file_url?: string | null
          id?: number
          is_approved?: boolean | null
          journey_slug?: string | null
          needs_moderation?: boolean | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sacred_tasks: {
        Row: {
          blueprint_id: string | null
          content: string | null
          created_at: string | null
          id: string
          priority: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blueprint_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          priority?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blueprint_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          priority?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_tasks_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "sacred_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_thread_participants: {
        Row: {
          id: string
          joined_at: string | null
          last_read_at: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sacred_message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sacred_weaving_records: {
        Row: {
          content: string
          created_at: string
          id: string
          initiator: string
          metadata: Json | null
          participants: string[]
          resonance_level: number
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          initiator: string
          metadata?: Json | null
          participants?: string[]
          resonance_level: number
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          initiator?: string
          metadata?: Json | null
          participants?: string[]
          resonance_level?: number
          type?: string
        }
        Relationships: []
      }
      secure_conversations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_group: boolean | null
          last_message_at: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seed_invitations: {
        Row: {
          id: string
          invitation_status: string | null
          invitee_id: string | null
          inviter_id: string | null
          message_payload: Json | null
          outreach_method: string | null
          potential_seed_id: string | null
          response_signature: string | null
          response_time: string | null
          seed_id: string | null
        }
        Insert: {
          id?: string
          invitation_status?: string | null
          invitee_id?: string | null
          inviter_id?: string | null
          message_payload?: Json | null
          outreach_method?: string | null
          potential_seed_id?: string | null
          response_signature?: string | null
          response_time?: string | null
          seed_id?: string | null
        }
        Update: {
          id?: string
          invitation_status?: string | null
          invitee_id?: string | null
          inviter_id?: string | null
          message_payload?: Json | null
          outreach_method?: string | null
          potential_seed_id?: string | null
          response_signature?: string | null
          response_time?: string | null
          seed_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_seed"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "seeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seed_invitations_potential_seed_id_fkey"
            columns: ["potential_seed_id"]
            isOneToOne: false
            referencedRelation: "potential_seeds"
            referencedColumns: ["id"]
          },
        ]
      }
      seeds: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          frequency: string | null
          id: string
          name: string
          telos: string | null
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name: string
          telos?: string | null
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name?: string
          telos?: string | null
        }
        Relationships: []
      }
      sephirot: {
        Row: {
          description: string | null
          id: string
          name: string
          pillar: string | null
          position_x: number | null
          position_y: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          pillar?: string | null
          position_x?: number | null
          position_y?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          pillar?: string | null
          position_x?: number | null
          position_y?: number | null
        }
        Relationships: []
      }
      session_logs: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          importance: number | null
          metadata: Json | null
          project: string
          related_to: string | null
          session_type: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          project: string
          related_to?: string | null
          session_type?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          project?: string
          related_to?: string | null
          session_type?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_logs_related_to_fkey"
            columns: ["related_to"]
            isOneToOne: false
            referencedRelation: "session_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      session_reflections: {
        Row: {
          content: string
          id: string
          session_id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          session_id: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          session_id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          frequency_id: string | null
          id: string
          initial_mood: string | null
          intention: string | null
          is_anonymous: boolean | null
          shared_with: string[] | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_id?: string | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_id?: string | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      sigil_boards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          stickers: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          stickers?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          stickers?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_content: string | null
          accent_color: string | null
          background_style: string | null
          font_body: string | null
          font_heading: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          about_content?: string | null
          accent_color?: string | null
          background_style?: string | null
          font_body?: string | null
          font_heading?: string | null
          id: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          about_content?: string | null
          accent_color?: string | null
          background_style?: string | null
          font_body?: string | null
          font_heading?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      songline_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          node_id: string
          related_node_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          node_id: string
          related_node_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          node_id?: string
          related_node_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songline_events_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "dream_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songline_events_related_node_id_fkey"
            columns: ["related_node_id"]
            isOneToOne: false
            referencedRelation: "dream_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      sonic_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          resonance_rating: number
          session_metadata: Json | null
          user_id: string | null
          wants_to_contribute: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          resonance_rating: number
          session_metadata?: Json | null
          user_id?: string | null
          wants_to_contribute?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          resonance_rating?: number
          session_metadata?: Json | null
          user_id?: string | null
          wants_to_contribute?: boolean | null
        }
        Relationships: []
      }
      sonic_glyphs: {
        Row: {
          audio_url: string
          created_at: string | null
          curated_by: string | null
          description: string
          fractal_intensity: number | null
          harmonic_complexity: number | null
          id: string
          intended_state: string[] | null
          is_curated: boolean | null
          mood: string[] | null
          name: string
          suno_generation_id: string | null
          suno_prompt: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          curated_by?: string | null
          description: string
          fractal_intensity?: number | null
          harmonic_complexity?: number | null
          id?: string
          intended_state?: string[] | null
          is_curated?: boolean | null
          mood?: string[] | null
          name: string
          suno_generation_id?: string | null
          suno_prompt?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          curated_by?: string | null
          description?: string
          fractal_intensity?: number | null
          harmonic_complexity?: number | null
          id?: string
          intended_state?: string[] | null
          is_curated?: boolean | null
          mood?: string[] | null
          name?: string
          suno_generation_id?: string | null
          suno_prompt?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sonic_sessions: {
        Row: {
          coherence_score: number | null
          created_at: string | null
          effects_config: Json | null
          file_url: string | null
          frequency_hz: number
          id: string
          integrity_score: number | null
          processing_mode: string
          session_name: string
          user_id: string | null
        }
        Insert: {
          coherence_score?: number | null
          created_at?: string | null
          effects_config?: Json | null
          file_url?: string | null
          frequency_hz: number
          id?: string
          integrity_score?: number | null
          processing_mode: string
          session_name: string
          user_id?: string | null
        }
        Update: {
          coherence_score?: number | null
          created_at?: string | null
          effects_config?: Json | null
          file_url?: string | null
          frequency_hz?: number
          id?: string
          integrity_score?: number | null
          processing_mode?: string
          session_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      soul_companions: {
        Row: {
          bio: string | null
          birth_date: string | null
          candle_lit_dates: string[] | null
          chakra_alignment: string | null
          created_at: string | null
          favorite_memory: string | null
          frequency_signature: number | null
          id: string
          lessons_taught: string | null
          name: string
          photo_url: string | null
          species: string | null
          transition_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          candle_lit_dates?: string[] | null
          chakra_alignment?: string | null
          created_at?: string | null
          favorite_memory?: string | null
          frequency_signature?: number | null
          id?: string
          lessons_taught?: string | null
          name: string
          photo_url?: string | null
          species?: string | null
          transition_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          candle_lit_dates?: string[] | null
          chakra_alignment?: string | null
          created_at?: string | null
          favorite_memory?: string | null
          frequency_signature?: number | null
          id?: string
          lessons_taught?: string | null
          name?: string
          photo_url?: string | null
          species?: string | null
          transition_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      soul_hugs: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean
          message: string
          recipient_id: string | null
          sender_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean
          message: string
          recipient_id?: string | null
          sender_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string
          recipient_id?: string | null
          sender_id?: string
          tag?: string
        }
        Relationships: []
      }
      soul_integrations: {
        Row: {
          coherence_score: number | null
          created_at: string | null
          generated_affirmation: string | null
          id: string
          integration_text: string
          related_session_ids: string[] | null
          themes: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coherence_score?: number | null
          created_at?: string | null
          generated_affirmation?: string | null
          id?: string
          integration_text: string
          related_session_ids?: string[] | null
          themes?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coherence_score?: number | null
          created_at?: string | null
          generated_affirmation?: string | null
          id?: string
          integration_text?: string
          related_session_ids?: string[] | null
          themes?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      soul_journey_sessions: {
        Row: {
          consciousness_expansion_level: number | null
          created_at: string | null
          duration_minutes: number
          frequencies_used: number[] | null
          id: string
          insights_gained: string | null
          journey_type: string
          user_id: string
        }
        Insert: {
          consciousness_expansion_level?: number | null
          created_at?: string | null
          duration_minutes?: number
          frequencies_used?: number[] | null
          id?: string
          insights_gained?: string | null
          journey_type: string
          user_id: string
        }
        Update: {
          consciousness_expansion_level?: number | null
          created_at?: string | null
          duration_minutes?: number
          frequencies_used?: number[] | null
          id?: string
          insights_gained?: string | null
          journey_type?: string
          user_id?: string
        }
        Relationships: []
      }
      soul_profiles: {
        Row: {
          active_journeys: string[] | null
          chakra_states: Json | null
          completed_journeys: string[] | null
          created_at: string | null
          id: string
          level: number | null
          reflection_logs: Json | null
          soul_signature: Json | null
          updated_at: string | null
          user_id: string
          xp: number | null
        }
        Insert: {
          active_journeys?: string[] | null
          chakra_states?: Json | null
          completed_journeys?: string[] | null
          created_at?: string | null
          id?: string
          level?: number | null
          reflection_logs?: Json | null
          soul_signature?: Json | null
          updated_at?: string | null
          user_id: string
          xp?: number | null
        }
        Update: {
          active_journeys?: string[] | null
          chakra_states?: Json | null
          completed_journeys?: string[] | null
          created_at?: string | null
          id?: string
          level?: number | null
          reflection_logs?: Json | null
          soul_signature?: Json | null
          updated_at?: string | null
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      soul_thread_entries: {
        Row: {
          chakra_tag: string | null
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          shared_with: string[] | null
          thread_id: string
          updated_at: string | null
          user_id: string
          visibility: string | null
          xp_earned: number | null
        }
        Insert: {
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          thread_id: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Update: {
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          thread_id?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soul_thread_entries_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "soul_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      soul_threads: {
        Row: {
          chakra_focus: string | null
          created_at: string | null
          description: string | null
          id: string
          is_anonymous: boolean | null
          is_public: boolean | null
          shared_with: string[] | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          chakra_focus?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          shared_with?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          chakra_focus?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          shared_with?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      sound_codex_entries: {
        Row: {
          audio_url: string | null
          chakra: string | null
          created_at: string | null
          frequency: number | null
          glyph_url: string | null
          id: string
          ideal_waveform: Json | null
          syllable: string | null
        }
        Insert: {
          audio_url?: string | null
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          glyph_url?: string | null
          id?: string
          ideal_waveform?: Json | null
          syllable?: string | null
        }
        Update: {
          audio_url?: string | null
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          glyph_url?: string | null
          id?: string
          ideal_waveform?: Json | null
          syllable?: string | null
        }
        Relationships: []
      }
      sovereignty_assessments: {
        Row: {
          assessed_at: string
          assessment_data: Json
          growth_rate: number | null
          id: string
          previous_level: number | null
          sovereignty_level: number
          user_id: string
        }
        Insert: {
          assessed_at?: string
          assessment_data: Json
          growth_rate?: number | null
          id?: string
          previous_level?: number | null
          sovereignty_level: number
          user_id: string
        }
        Update: {
          assessed_at?: string
          assessment_data?: Json
          growth_rate?: number | null
          id?: string
          previous_level?: number | null
          sovereignty_level?: number
          user_id?: string
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      spoken_glyph_logs: {
        Row: {
          audio_url: string | null
          created_at: string | null
          glyph_id: string | null
          id: string
          user_id: string | null
          waveform_data: Json | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          glyph_id?: string | null
          id?: string
          user_id?: string | null
          waveform_data?: Json | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          glyph_id?: string | null
          id?: string
          user_id?: string | null
          waveform_data?: Json | null
          word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spoken_glyph_logs_glyph_id_fkey"
            columns: ["glyph_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          credits_per_period: number
          features: Json | null
          id: string
          is_best_value: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          songs_equivalent: number
          yearly_discount: number | null
        }
        Insert: {
          credits_per_period: number
          features?: Json | null
          id?: string
          is_best_value?: boolean | null
          is_popular?: boolean | null
          name: string
          period: string
          price: number
          songs_equivalent: number
          yearly_discount?: number | null
        }
        Update: {
          credits_per_period?: number
          features?: Json | null
          id?: string
          is_best_value?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          songs_equivalent?: number
          yearly_discount?: number | null
        }
        Relationships: []
      }
      sync_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          intensity: number | null
          suggested_journeys: Json | null
          summary: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          intensity?: number | null
          suggested_journeys?: Json | null
          summary: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          intensity?: number | null
          suggested_journeys?: Json | null
          summary?: string
        }
        Relationships: []
      }
      sync_metadata: {
        Row: {
          created_at: string
          device_fingerprint: string
          encryption_checksum: string | null
          id: string
          last_full_sync: string | null
          total_policies: number | null
          total_risks: number | null
          total_settings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          encryption_checksum?: string | null
          id?: string
          last_full_sync?: string | null
          total_policies?: number | null
          total_risks?: number | null
          total_settings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          encryption_checksum?: string | null
          id?: string
          last_full_sync?: string | null
          total_policies?: number | null
          total_risks?: number | null
          total_settings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      synced_policies: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          encrypted_data: string
          id: string
          policy_id: string
          sync_timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_data: string
          id?: string
          policy_id: string
          sync_timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_data?: string
          id?: string
          policy_id?: string
          sync_timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      synced_risks: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          encrypted_data: string
          id: string
          risk_id: string
          sync_timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_data: string
          id?: string
          risk_id: string
          sync_timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_data?: string
          id?: string
          risk_id?: string
          sync_timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      synced_settings: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          encrypted_value: string
          id: string
          setting_key: string
          sync_timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_value: string
          id?: string
          setting_key: string
          sync_timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          encrypted_value?: string
          id?: string
          setting_key?: string
          sync_timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      synchronicity_events: {
        Row: {
          acknowledged: boolean | null
          connections: Json | null
          created_at: string
          event_data: Json
          event_type: string
          id: string
          interpretation: Json | null
          significance_score: number | null
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          connections?: Json | null
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          interpretation?: Json | null
          significance_score?: number | null
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          connections?: Json | null
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          interpretation?: Json | null
          significance_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      synchronicity_logs: {
        Row: {
          description: string
          frequency: number | null
          id: string
          recorded_at: string | null
          shared_publicly: boolean | null
          synchronicity_type: string
          user_id: string
        }
        Insert: {
          description: string
          frequency?: number | null
          id?: string
          recorded_at?: string | null
          shared_publicly?: boolean | null
          synchronicity_type: string
          user_id: string
        }
        Update: {
          description?: string
          frequency?: number | null
          id?: string
          recorded_at?: string | null
          shared_publicly?: boolean | null
          synchronicity_type?: string
          user_id?: string
        }
        Relationships: []
      }
      system_state: {
        Row: {
          active_modules: string[] | null
          chakra_focus: string | null
          id: string
          integrity_score: number | null
          telos_alignment: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          active_modules?: string[] | null
          chakra_focus?: string | null
          id?: string
          integrity_score?: number | null
          telos_alignment?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          active_modules?: string[] | null
          chakra_focus?: string | null
          id?: string
          integrity_score?: number | null
          telos_alignment?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      system_status: {
        Row: {
          active_modules: string[] | null
          aural_state: string | null
          chakra_alignment: string | null
          coherence_level: number | null
          id: string
          initiated_by: string | null
          integrity_score: number | null
          last_calibration: string | null
          last_check: string | null
        }
        Insert: {
          active_modules?: string[] | null
          aural_state?: string | null
          chakra_alignment?: string | null
          coherence_level?: number | null
          id?: string
          initiated_by?: string | null
          integrity_score?: number | null
          last_calibration?: string | null
          last_check?: string | null
        }
        Update: {
          active_modules?: string[] | null
          aural_state?: string | null
          chakra_alignment?: string | null
          coherence_level?: number | null
          id?: string
          initiated_by?: string | null
          integrity_score?: number | null
          last_calibration?: string | null
          last_check?: string | null
        }
        Relationships: []
      }
      tarot_archetypes: {
        Row: {
          affirmation: string | null
          created_at: string | null
          frequency_signature: number | null
          id: string
          keywords: string[] | null
          major_arcana_number: number | null
          title: string
          tree_path_from: string | null
          tree_path_to: string | null
          visual_animation_type: string | null
          visual_type: string | null
        }
        Insert: {
          affirmation?: string | null
          created_at?: string | null
          frequency_signature?: number | null
          id?: string
          keywords?: string[] | null
          major_arcana_number?: number | null
          title: string
          tree_path_from?: string | null
          tree_path_to?: string | null
          visual_animation_type?: string | null
          visual_type?: string | null
        }
        Update: {
          affirmation?: string | null
          created_at?: string | null
          frequency_signature?: number | null
          id?: string
          keywords?: string[] | null
          major_arcana_number?: number | null
          title?: string
          tree_path_from?: string | null
          tree_path_to?: string | null
          visual_animation_type?: string | null
          visual_type?: string | null
        }
        Relationships: []
      }
      tarot_module_progress: {
        Row: {
          completion_date: string | null
          created_at: string | null
          frequency_value: number | null
          glyph_id: string | null
          id: string
          status: string
          tarot_key: string
          updated_at: string | null
          user_id: string
          voice_url: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          frequency_value?: number | null
          glyph_id?: string | null
          id?: string
          status?: string
          tarot_key: string
          updated_at?: string | null
          user_id: string
          voice_url?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          frequency_value?: number | null
          glyph_id?: string | null
          id?: string
          status?: string
          tarot_key?: string
          updated_at?: string | null
          user_id?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarot_module_progress_glyph_id_fkey"
            columns: ["glyph_id"]
            isOneToOne: false
            referencedRelation: "fractal_glyphs"
            referencedColumns: ["id"]
          },
        ]
      }
      tarot_reflections: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          question: string
          shared_with: string[] | null
          tarot_key: string
          tarot_progress_id: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          question: string
          shared_with?: string[] | null
          tarot_key: string
          tarot_progress_id?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          question?: string
          shared_with?: string[] | null
          tarot_key?: string
          tarot_progress_id?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarot_reflections_tarot_progress_id_fkey"
            columns: ["tarot_progress_id"]
            isOneToOne: false
            referencedRelation: "tarot_module_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_completed: boolean | null
          is_recurring: boolean | null
          time: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          time?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tattoo_journal_entries: {
        Row: {
          chakra_tag: string | null
          content: string
          created_at: string | null
          emotion_tag: string | null
          frequency: number | null
          id: string
          is_favorite: boolean | null
          journey_reference: string | null
          mirror_session_id: string | null
          sigil_data: Json | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          emotion_tag?: string | null
          frequency?: number | null
          id?: string
          is_favorite?: boolean | null
          journey_reference?: string | null
          mirror_session_id?: string | null
          sigil_data?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          emotion_tag?: string | null
          frequency?: number | null
          id?: string
          is_favorite?: boolean | null
          journey_reference?: string | null
          mirror_session_id?: string | null
          sigil_data?: Json | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tattoo_journal_entries_mirror_session_id_fkey"
            columns: ["mirror_session_id"]
            isOneToOne: false
            referencedRelation: "fractal_mirror_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomy_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          level: number
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomy_terms: {
        Row: {
          category_id: string | null
          code: string | null
          created_at: string
          description: string | null
          disposal_action: string | null
          id: string
          is_active: boolean | null
          name: string
          retention_period_years: number | null
          security_classification: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          disposal_action?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          retention_period_years?: number | null
          security_classification?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          disposal_action?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          retention_period_years?: number | null
          security_classification?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_terms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      temporary_data_store: {
        Row: {
          content: Json
          created_at: string
          data_type: string
          expires_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string
          data_type: string
          expires_at: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          data_type?: string
          expires_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thread_members: {
        Row: {
          joined_at: string | null
          last_read_at: string | null
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          last_read_at?: string | null
          role?: string
          thread_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          last_read_at?: string | null
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_members_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_group: boolean
          title: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_group?: boolean
          title?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_group?: boolean
          title?: string | null
        }
        Relationships: []
      }
      timeline_activations: {
        Row: {
          activation_details: string
          activation_type: string
          created_at: string | null
          id: string
          node_id: string
          user_id: string
        }
        Insert: {
          activation_details: string
          activation_type: string
          created_at?: string | null
          id?: string
          node_id: string
          user_id: string
        }
        Update: {
          activation_details?: string
          activation_type?: string
          created_at?: string | null
          id?: string
          node_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_activations_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "timeline_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_nodes: {
        Row: {
          chakra_focus: string
          consciousness_level: number
          created_at: string | null
          description: string
          guidance: string | null
          id: string
          is_activated: boolean
          is_pivot_point: boolean
          parent_node_id: string | null
          probability: number
          time_distance: number
          timeline_position: string
          title: string
          user_id: string
        }
        Insert: {
          chakra_focus: string
          consciousness_level: number
          created_at?: string | null
          description: string
          guidance?: string | null
          id?: string
          is_activated?: boolean
          is_pivot_point?: boolean
          parent_node_id?: string | null
          probability: number
          time_distance: number
          timeline_position: string
          title: string
          user_id: string
        }
        Update: {
          chakra_focus?: string
          consciousness_level?: number
          created_at?: string | null
          description?: string
          guidance?: string | null
          id?: string
          is_activated?: boolean
          is_pivot_point?: boolean
          parent_node_id?: string | null
          probability?: number
          time_distance?: number
          timeline_position?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_nodes_parent_node_id_fkey"
            columns: ["parent_node_id"]
            isOneToOne: false
            referencedRelation: "timeline_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_paths: {
        Row: {
          consciousness_delta: number
          created_at: string | null
          description: string
          id: string
          nodes: string[]
          path_type: string
          probability: number
          title: string
          user_id: string
        }
        Insert: {
          consciousness_delta: number
          created_at?: string | null
          description: string
          id?: string
          nodes: string[]
          path_type: string
          probability: number
          title: string
          user_id: string
        }
        Update: {
          consciousness_delta?: number
          created_at?: string | null
          description?: string
          id?: string
          nodes?: string[]
          path_type?: string
          probability?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      timeline_reflections: {
        Row: {
          consciousness_shift: number
          created_at: string | null
          id: string
          node_id: string
          reflection_text: string
          user_id: string
        }
        Insert: {
          consciousness_shift?: number
          created_at?: string | null
          id?: string
          node_id: string
          reflection_text: string
          user_id: string
        }
        Update: {
          consciousness_shift?: number
          created_at?: string | null
          id?: string
          node_id?: string
          reflection_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_reflections_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "timeline_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_snapshots: {
        Row: {
          action: string | null
          chakra: string | null
          component: string | null
          created_at: string | null
          details: Json | null
          frequency: number | null
          id: string
          intention: string | null
          is_anonymous: boolean | null
          journey_id: string | null
          notes: string | null
          shared_with: string[] | null
          tag: string | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
          visual_type: string | null
        }
        Insert: {
          action?: string | null
          chakra?: string | null
          component?: string | null
          created_at?: string | null
          details?: Json | null
          frequency?: number | null
          id?: string
          intention?: string | null
          is_anonymous?: boolean | null
          journey_id?: string | null
          notes?: string | null
          shared_with?: string[] | null
          tag?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          visual_type?: string | null
        }
        Update: {
          action?: string | null
          chakra?: string | null
          component?: string | null
          created_at?: string | null
          details?: Json | null
          frequency?: number | null
          id?: string
          intention?: string | null
          is_anonymous?: boolean | null
          journey_id?: string | null
          notes?: string | null
          shared_with?: string[] | null
          tag?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          visual_type?: string | null
        }
        Relationships: []
      }
      training_materials: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          download_count: number | null
          file_size_mb: number | null
          file_type: string
          file_url: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          download_count?: number | null
          file_size_mb?: number | null
          file_type: string
          file_url: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          download_count?: number | null
          file_size_mb?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      transit_insights: {
        Row: {
          aspect: string
          chakra_alignment: string | null
          created_at: string | null
          description: string
          id: string
          intensity: string
          keywords: string[] | null
          planet_from: string
          planet_to: string
          title: string
          transit_type: string
          typical_duration_days: number | null
        }
        Insert: {
          aspect: string
          chakra_alignment?: string | null
          created_at?: string | null
          description: string
          id?: string
          intensity: string
          keywords?: string[] | null
          planet_from: string
          planet_to: string
          title: string
          transit_type: string
          typical_duration_days?: number | null
        }
        Update: {
          aspect?: string
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string
          id?: string
          intensity?: string
          keywords?: string[] | null
          planet_from?: string
          planet_to?: string
          title?: string
          transit_type?: string
          typical_duration_days?: number | null
        }
        Relationships: []
      }
      transit_insights_reference: {
        Row: {
          aspect: string | null
          chakra_alignment: string | null
          created_at: string
          description: string | null
          id: number
          intensity: string | null
          keywords: string | null
          planet_from: string | null
          planet_to: string | null
          zodiac_sign: string | null
        }
        Insert: {
          aspect?: string | null
          chakra_alignment?: string | null
          created_at?: string
          description?: string | null
          id?: number
          intensity?: string | null
          keywords?: string | null
          planet_from?: string | null
          planet_to?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          aspect?: string | null
          chakra_alignment?: string | null
          created_at?: string
          description?: string | null
          id?: number
          intensity?: string | null
          keywords?: string | null
          planet_from?: string | null
          planet_to?: string | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      trauma_integration_reflections: {
        Row: {
          associated_symbols: string[] | null
          created_at: string | null
          dream_log_id: string | null
          emotional_tags: string[] | null
          id: string
          integration_status: string | null
          reflection_content: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          associated_symbols?: string[] | null
          created_at?: string | null
          dream_log_id?: string | null
          emotional_tags?: string[] | null
          id?: string
          integration_status?: string | null
          reflection_content: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          associated_symbols?: string[] | null
          created_at?: string | null
          dream_log_id?: string | null
          emotional_tags?: string[] | null
          id?: string
          integration_status?: string | null
          reflection_content?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trauma_integration_reflections_dream_log_id_fkey"
            columns: ["dream_log_id"]
            isOneToOne: false
            referencedRelation: "dream_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_of_life_paths: {
        Row: {
          activation_instruction: string | null
          created_at: string | null
          cymatic_pattern: string | null
          emotional_alchemy: string | null
          frequency_hz: number | null
          from_sephirah: string
          geometry: string | null
          hebrew_letter: string | null
          id: string
          letter_meaning: string | null
          path_number: number
          tarot: string | null
          to_sephirah: string
          vocal_chant: string | null
        }
        Insert: {
          activation_instruction?: string | null
          created_at?: string | null
          cymatic_pattern?: string | null
          emotional_alchemy?: string | null
          frequency_hz?: number | null
          from_sephirah: string
          geometry?: string | null
          hebrew_letter?: string | null
          id: string
          letter_meaning?: string | null
          path_number: number
          tarot?: string | null
          to_sephirah: string
          vocal_chant?: string | null
        }
        Update: {
          activation_instruction?: string | null
          created_at?: string | null
          cymatic_pattern?: string | null
          emotional_alchemy?: string | null
          frequency_hz?: number | null
          from_sephirah?: string
          geometry?: string | null
          hebrew_letter?: string | null
          id?: string
          letter_meaning?: string | null
          path_number?: number
          tarot?: string | null
          to_sephirah?: string
          vocal_chant?: string | null
        }
        Relationships: []
      }
      triad_memberships: {
        Row: {
          id: string
          path_id: string | null
          triad_id: string | null
        }
        Insert: {
          id?: string
          path_id?: string | null
          triad_id?: string | null
        }
        Update: {
          id?: string
          path_id?: string | null
          triad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "triad_memberships_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "archetype_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "triad_memberships_triad_id_fkey"
            columns: ["triad_id"]
            isOneToOne: false
            referencedRelation: "triads"
            referencedColumns: ["id"]
          },
        ]
      }
      triads: {
        Row: {
          description: string | null
          id: string
          name: string
          synthesis_text: string | null
          visual_url: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          synthesis_text?: string | null
          visual_url?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          synthesis_text?: string | null
          visual_url?: string | null
        }
        Relationships: []
      }
      unity_coherence_evaluations: {
        Row: {
          authenticity_score: number | null
          constructiveness_score: number | null
          created_at: string | null
          evaluation_notes: string | null
          evaluator_id: string | null
          id: string
          node_id: string
          overall_coherence_score: number | null
          unity_score: number | null
          updated_at: string | null
        }
        Insert: {
          authenticity_score?: number | null
          constructiveness_score?: number | null
          created_at?: string | null
          evaluation_notes?: string | null
          evaluator_id?: string | null
          id?: string
          node_id: string
          overall_coherence_score?: number | null
          unity_score?: number | null
          updated_at?: string | null
        }
        Update: {
          authenticity_score?: number | null
          constructiveness_score?: number | null
          created_at?: string | null
          evaluation_notes?: string | null
          evaluator_id?: string | null
          id?: string
          node_id?: string
          overall_coherence_score?: number | null
          unity_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unity_coherence_evaluations_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "unity_vision_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      unity_connections: {
        Row: {
          connection_description: string | null
          connection_strength: number | null
          connection_type: string
          created_at: string | null
          id: string
          source_node_id: string
          target_node_id: string
          updated_at: string | null
        }
        Insert: {
          connection_description?: string | null
          connection_strength?: number | null
          connection_type: string
          created_at?: string | null
          id?: string
          source_node_id: string
          target_node_id: string
          updated_at?: string | null
        }
        Update: {
          connection_description?: string | null
          connection_strength?: number | null
          connection_type?: string
          created_at?: string | null
          id?: string
          source_node_id?: string
          target_node_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unity_connections_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "unity_vision_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unity_connections_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "unity_vision_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      unity_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_content: string | null
          interaction_type: string
          node_id: string
          resonance_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_content?: string | null
          interaction_type: string
          node_id: string
          resonance_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_content?: string | null
          interaction_type?: string
          node_id?: string
          resonance_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unity_interactions_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "unity_vision_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      unity_vision_boards: {
        Row: {
          board_layout: Json | null
          board_theme: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          nodes: string[] | null
          timeline_end: string | null
          timeline_start: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          board_layout?: Json | null
          board_theme?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          nodes?: string[] | null
          timeline_end?: string | null
          timeline_start?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          board_layout?: Json | null
          board_theme?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          nodes?: string[] | null
          timeline_end?: string | null
          timeline_start?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unity_vision_nodes: {
        Row: {
          chakra_alignment: string | null
          created_at: string | null
          description: string | null
          frequency_hz: number | null
          id: string
          is_public: boolean | null
          location: Json | null
          media_url: string | null
          resonance_score: number | null
          sacred_geometry_pattern: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visualization_data: Json | null
        }
        Insert: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          frequency_hz?: number | null
          id?: string
          is_public?: boolean | null
          location?: Json | null
          media_url?: string | null
          resonance_score?: number | null
          sacred_geometry_pattern?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visualization_data?: Json | null
        }
        Update: {
          chakra_alignment?: string | null
          created_at?: string | null
          description?: string | null
          frequency_hz?: number | null
          id?: string
          is_public?: boolean | null
          location?: Json | null
          media_url?: string | null
          resonance_score?: number | null
          sacred_geometry_pattern?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visualization_data?: Json | null
        }
        Relationships: []
      }
      universal_resonance_records: {
        Row: {
          attunement_steps: Json | null
          consciousness_type: string
          created_at: string | null
          duration_seconds: number | null
          frequency: number
          id: string
          insights: string[] | null
          resonance_level: number | null
          user_id: string
        }
        Insert: {
          attunement_steps?: Json | null
          consciousness_type: string
          created_at?: string | null
          duration_seconds?: number | null
          frequency: number
          id?: string
          insights?: string[] | null
          resonance_level?: number | null
          user_id: string
        }
        Update: {
          attunement_steps?: Json | null
          consciousness_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          frequency?: number
          id?: string
          insights?: string[] | null
          resonance_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_archetypes: {
        Row: {
          archetype: string
          date_assigned: string | null
          id: string
          traits: Json | null
          user_id: string | null
        }
        Insert: {
          archetype: string
          date_assigned?: string | null
          id?: string
          traits?: Json | null
          user_id?: string | null
        }
        Update: {
          archetype?: string
          date_assigned?: string | null
          id?: string
          traits?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_ascension_roles: {
        Row: {
          acquired_at: string | null
          ascension_role_id: string
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          ascension_role_id: string
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          acquired_at?: string | null
          ascension_role_id?: string
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ascension_roles_ascension_role_id_fkey"
            columns: ["ascension_role_id"]
            isOneToOne: false
            referencedRelation: "ascension_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_astrology_data: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string | null
          created_at: string | null
          dominant_element: string | null
          id: string
          moon_sign: string | null
          rising_sign: string | null
          sun_sign: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time?: string | null
          created_at?: string | null
          dominant_element?: string | null
          id?: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          created_at?: string | null
          dominant_element?: string | null
          id?: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_astrology_profiles: {
        Row: {
          birth_date: string
          birth_place: string | null
          birth_time: string | null
          created_at: string | null
          metadata: Json | null
          natal_chart: Json | null
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string | null
          metadata?: Json | null
          natal_chart?: Json | null
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string | null
          metadata?: Json | null
          natal_chart?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_birth_charts: {
        Row: {
          ascendant: number | null
          created_at: string | null
          jupiter_position: number | null
          mars_position: number | null
          mercury_position: number | null
          moon_position: number | null
          neptune_position: number | null
          pluto_position: number | null
          saturn_position: number | null
          sun_position: number | null
          uranus_position: number | null
          user_id: string
          venus_position: number | null
        }
        Insert: {
          ascendant?: number | null
          created_at?: string | null
          jupiter_position?: number | null
          mars_position?: number | null
          mercury_position?: number | null
          moon_position?: number | null
          neptune_position?: number | null
          pluto_position?: number | null
          saturn_position?: number | null
          sun_position?: number | null
          uranus_position?: number | null
          user_id: string
          venus_position?: number | null
        }
        Update: {
          ascendant?: number | null
          created_at?: string | null
          jupiter_position?: number | null
          mars_position?: number | null
          mercury_position?: number | null
          moon_position?: number | null
          neptune_position?: number | null
          pluto_position?: number | null
          saturn_position?: number | null
          sun_position?: number | null
          uranus_position?: number | null
          user_id?: string
          venus_position?: number | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_chakra_activations: {
        Row: {
          activation_type: string
          chakra_tag: string
          created_at: string | null
          id: string
          journey_id: string | null
          user_id: string
        }
        Insert: {
          activation_type: string
          chakra_tag: string
          created_at?: string | null
          id?: string
          journey_id?: string | null
          user_id: string
        }
        Update: {
          activation_type?: string
          chakra_tag?: string
          created_at?: string | null
          id?: string
          journey_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number | null
          last_updated: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          last_updated?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_encryption_keys: {
        Row: {
          created_at: string | null
          id: string
          public_key: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          public_key: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          public_key?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_features: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          is_enabled: boolean | null
          metadata: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_friend_requests: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id: string
          sender_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_intentions: {
        Row: {
          created_at: string | null
          id: string
          intention: string
          is_anonymous: boolean | null
          shared_with: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intention: string
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intention?: string
          is_anonymous?: boolean | null
          shared_with?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      user_journey_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          journey_id: string | null
          mood_rating: number | null
          reflection: string | null
          shared_with: string[] | null
          unlocked_scroll_id: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          journey_id?: string | null
          mood_rating?: number | null
          reflection?: string | null
          shared_with?: string[] | null
          unlocked_scroll_id?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          journey_id?: string | null
          mood_rating?: number | null
          reflection?: string | null
          shared_with?: string[] | null
          unlocked_scroll_id?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_journey_progress_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_journey_progress_unlocked_scroll_id_fkey"
            columns: ["unlocked_scroll_id"]
            isOneToOne: false
            referencedRelation: "akashic_vault_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          related_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_path_activations: {
        Row: {
          activation_date: string | null
          activation_method: string | null
          created_at: string | null
          id: string
          notes: string | null
          path_id: string | null
          resonance_score: number | null
          user_id: string | null
        }
        Insert: {
          activation_date?: string | null
          activation_method?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          path_id?: string | null
          resonance_score?: number | null
          user_id?: string | null
        }
        Update: {
          activation_date?: string | null
          activation_method?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          path_id?: string | null
          resonance_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_path_activations_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "tree_of_life_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_practice_completions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          effectiveness_rating: number | null
          id: string
          practice_id: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          effectiveness_rating?: number | null
          id?: string
          practice_id: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          effectiveness_rating?: number | null
          id?: string
          practice_id?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_practice_completions_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "integration_practices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          consciousness_mode: string | null
          created_at: string | null
          element: string | null
          id: string
          kent_mode: boolean | null
          soundscape_mode: string | null
          theme_gradient: string | null
          updated_at: string | null
          user_id: string | null
          watermark_style: string | null
          zodiac_sign: string | null
        }
        Insert: {
          consciousness_mode?: string | null
          created_at?: string | null
          element?: string | null
          id?: string
          kent_mode?: boolean | null
          soundscape_mode?: string | null
          theme_gradient?: string | null
          updated_at?: string | null
          user_id?: string | null
          watermark_style?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          consciousness_mode?: string | null
          created_at?: string | null
          element?: string | null
          id?: string
          kent_mode?: boolean | null
          soundscape_mode?: string | null
          theme_gradient?: string | null
          updated_at?: string | null
          user_id?: string | null
          watermark_style?: string | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      user_preset_favorites: {
        Row: {
          created_at: string | null
          preset_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          preset_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          preset_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preset_favorites_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "visualization_presets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_privacy_settings: {
        Row: {
          analytics_consent: boolean
          created_at: string
          data_retention_preference: string | null
          id: string
          marketing_consent: boolean
          notifications_enabled: boolean
          profile_visibility: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_consent?: boolean
          created_at?: string
          data_retention_preference?: string | null
          id?: string
          marketing_consent?: boolean
          notifications_enabled?: boolean
          profile_visibility?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_consent?: boolean
          created_at?: string
          data_retention_preference?: string | null
          id?: string
          marketing_consent?: boolean
          notifications_enabled?: boolean
          profile_visibility?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          stage: string
          substage: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          stage: string
          substage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          stage?: string
          substage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_quests: {
        Row: {
          completed_at: string | null
          current_progress: number | null
          id: string
          quest_id: string
          rewarded: boolean | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          quest_id: string
          rewarded?: boolean | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          quest_id?: string
          rewarded?: boolean | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "ascension_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recommendation_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          feedback_type: string
          id: string
          module_id: string
          resonance_factors: Json | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          module_id: string
          resonance_factors?: Json | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          module_id?: string
          resonance_factors?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_ritual_completions: {
        Row: {
          created_at: string
          duration_seconds: number | null
          feedback: string | null
          id: string
          rating: number | null
          ritual_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          feedback?: string | null
          id?: string
          rating?: number | null
          ritual_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          feedback?: string | null
          id?: string
          rating?: number | null
          ritual_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ritual_completions_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "user_rituals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ritual_saves: {
        Row: {
          created_at: string
          id: string
          ritual_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ritual_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ritual_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ritual_saves_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "user_rituals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rituals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          intention: string | null
          is_public: boolean | null
          name: string
          sequences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          intention?: string | null
          is_public?: boolean | null
          name: string
          sequences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          intention?: string | null
          is_public?: boolean | null
          name?: string
          sequences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles_migration: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          project_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          project_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          project_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_migration_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_frequencies: {
        Row: {
          created_at: string | null
          frequency_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_frequencies_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_wisdom: {
        Row: {
          created_at: string | null
          id: string
          personal_reflection: string | null
          resonance_level: number | null
          updated_at: string | null
          user_id: string
          wisdom_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          personal_reflection?: string | null
          resonance_level?: number | null
          updated_at?: string | null
          user_id: string
          wisdom_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          personal_reflection?: string | null
          resonance_level?: number | null
          updated_at?: string | null
          user_id?: string
          wisdom_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_wisdom_wisdom_id_fkey"
            columns: ["wisdom_id"]
            isOneToOne: false
            referencedRelation: "bridgekeeper_wisdom"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scrolls: {
        Row: {
          id: string
          personal_notes: string | null
          saved_at: string | null
          scroll_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          personal_notes?: string | null
          saved_at?: string | null
          scroll_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          personal_notes?: string | null
          saved_at?: string | null
          scroll_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scrolls_scroll_id_fkey"
            columns: ["scroll_id"]
            isOneToOne: false
            referencedRelation: "akashic_vault_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sound_attempts: {
        Row: {
          audio_url: string | null
          codex_entry_id: string | null
          id: string
          resonance_score: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          codex_entry_id?: string | null
          id?: string
          resonance_score?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          codex_entry_id?: string | null
          id?: string
          resonance_score?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sound_attempts_codex_entry_id_fkey"
            columns: ["codex_entry_id"]
            isOneToOne: false
            referencedRelation: "sound_codex_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_yearly: boolean | null
          plan_id: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_transit_insights: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          logged_at: string | null
          notes: string | null
          personal_notes: string | null
          start_date: string
          transit_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logged_at?: string | null
          notes?: string | null
          personal_notes?: string | null
          start_date: string
          transit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logged_at?: string | null
          notes?: string | null
          personal_notes?: string | null
          start_date?: string
          transit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_transit_snapshots: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          snapshot_date: string | null
          transits: Json | null
          user_id: string | null
          vale_prompts: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          snapshot_date?: string | null
          transits?: Json | null
          user_id?: string | null
          vale_prompts?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          snapshot_date?: string | null
          transits?: Json | null
          user_id?: string | null
          vale_prompts?: Json | null
        }
        Relationships: []
      }
      user_video_metadata: {
        Row: {
          created_at: string | null
          id: string
          is_favorite: boolean | null
          is_watch_later: boolean | null
          last_watched_at: string | null
          updated_at: string | null
          user_id: string
          video_id: string
          watched_duration: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_watch_later?: boolean | null
          last_watched_at?: string | null
          updated_at?: string | null
          user_id: string
          video_id: string
          watched_duration?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_watch_later?: boolean | null
          last_watched_at?: string | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
          watched_duration?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      valeion_audit_results: {
        Row: {
          content_hash: string | null
          created_at: string
          explanation: string
          id: string
          input_text: string
          resonance_score: number
          schema_version: string | null
          truth_rewrite: string | null
          updated_at: string
          valeion_version: string | null
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          explanation: string
          id?: string
          input_text: string
          resonance_score: number
          schema_version?: string | null
          truth_rewrite?: string | null
          updated_at?: string
          valeion_version?: string | null
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          explanation?: string
          id?: string
          input_text?: string
          resonance_score?: number
          schema_version?: string | null
          truth_rewrite?: string | null
          updated_at?: string
          valeion_version?: string | null
        }
        Relationships: []
      }
      valeion_content_patterns: {
        Row: {
          created_at: string | null
          first_detected_at: string | null
          id: string
          last_detected_at: string | null
          metadata: Json | null
          occurrence_count: number | null
          pattern_hash: string
          pattern_type: string
          related_audit_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_detected_at?: string | null
          id?: string
          last_detected_at?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          pattern_hash: string
          pattern_type: string
          related_audit_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_detected_at?: string | null
          id?: string
          last_detected_at?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          pattern_hash?: string
          pattern_type?: string
          related_audit_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      valeion_distortion_flags: {
        Row: {
          audit_result_id: string
          created_at: string
          description: string
          flag_type: string
          id: string
          severity: string
        }
        Insert: {
          audit_result_id: string
          created_at?: string
          description: string
          flag_type: string
          id?: string
          severity: string
        }
        Update: {
          audit_result_id?: string
          created_at?: string
          description?: string
          flag_type?: string
          id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "valeion_distortion_flags_audit_result_id_fkey"
            columns: ["audit_result_id"]
            isOneToOne: false
            referencedRelation: "valeion_audit_results"
            referencedColumns: ["id"]
          },
        ]
      }
      valeion_monitor_log: {
        Row: {
          analysis_report: string
          content_hash: string | null
          created_at: string
          distortion_flags: Json
          id: string
          link: string | null
          resolved_at: string | null
          resonance_score: number
          source_name: string
          source_url: string
          status: string
          submitted_at: string
          truth_alignment: string
          updated_at: string
        }
        Insert: {
          analysis_report: string
          content_hash?: string | null
          created_at?: string
          distortion_flags?: Json
          id?: string
          link?: string | null
          resolved_at?: string | null
          resonance_score: number
          source_name: string
          source_url: string
          status?: string
          submitted_at?: string
          truth_alignment: string
          updated_at?: string
        }
        Update: {
          analysis_report?: string
          content_hash?: string | null
          created_at?: string
          distortion_flags?: Json
          id?: string
          link?: string | null
          resolved_at?: string | null
          resonance_score?: number
          source_name?: string
          source_url?: string
          status?: string
          submitted_at?: string
          truth_alignment?: string
          updated_at?: string
        }
        Relationships: []
      }
      valeion_monitor_targets: {
        Row: {
          check_frequency_minutes: number | null
          content_selectors: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_checked_at: string | null
          metadata: Json | null
          source_name: string
          source_type: string
          source_url: string
          updated_at: string | null
        }
        Insert: {
          check_frequency_minutes?: number | null
          content_selectors?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          metadata?: Json | null
          source_name: string
          source_type: string
          source_url: string
          updated_at?: string | null
        }
        Update: {
          check_frequency_minutes?: number | null
          content_selectors?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          metadata?: Json | null
          source_name?: string
          source_type?: string
          source_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      valeion_pattern_models: {
        Row: {
          created_at: string | null
          features: Json
          first_detected_at: string
          id: string
          last_detected_at: string
          metadata: Json | null
          occurrence_count: number | null
          pattern_hash: string
          pattern_type: string
          prediction_data: Json | null
          related_audit_ids: string[] | null
          sample_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features: Json
          first_detected_at: string
          id?: string
          last_detected_at: string
          metadata?: Json | null
          occurrence_count?: number | null
          pattern_hash: string
          pattern_type: string
          prediction_data?: Json | null
          related_audit_ids?: string[] | null
          sample_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          first_detected_at?: string
          id?: string
          last_detected_at?: string
          metadata?: Json | null
          occurrence_count?: number | null
          pattern_hash?: string
          pattern_type?: string
          prediction_data?: Json | null
          related_audit_ids?: string[] | null
          sample_text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      valeion_pattern_predictions: {
        Row: {
          actual_resonance_score: number | null
          confidence_scores: Json | null
          created_at: string | null
          id: string
          input_hash: string
          input_text: string
          pattern_id: string | null
          predicted_distortions: Json | null
          predicted_resonance_score: number | null
          prediction_accuracy: number | null
        }
        Insert: {
          actual_resonance_score?: number | null
          confidence_scores?: Json | null
          created_at?: string | null
          id?: string
          input_hash: string
          input_text: string
          pattern_id?: string | null
          predicted_distortions?: Json | null
          predicted_resonance_score?: number | null
          prediction_accuracy?: number | null
        }
        Update: {
          actual_resonance_score?: number | null
          confidence_scores?: Json | null
          created_at?: string | null
          id?: string
          input_hash?: string
          input_text?: string
          pattern_id?: string | null
          predicted_distortions?: Json | null
          predicted_resonance_score?: number | null
          prediction_accuracy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "valeion_pattern_predictions_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "valeion_pattern_models"
            referencedColumns: ["id"]
          },
        ]
      }
      valeion_pattern_relationships: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          relationship_type: string
          similarity_score: number | null
          source_pattern_id: string
          target_pattern_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          relationship_type: string
          similarity_score?: number | null
          source_pattern_id: string
          target_pattern_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          relationship_type?: string
          similarity_score?: number | null
          source_pattern_id?: string
          target_pattern_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valeion_pattern_relationships_source_pattern_id_fkey"
            columns: ["source_pattern_id"]
            isOneToOne: false
            referencedRelation: "valeion_pattern_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valeion_pattern_relationships_target_pattern_id_fkey"
            columns: ["target_pattern_id"]
            isOneToOne: false
            referencedRelation: "valeion_pattern_models"
            referencedColumns: ["id"]
          },
        ]
      }
      valeion_scheduled_audits: {
        Row: {
          created_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          result_id: string | null
          scheduled_at: string
          status: string | null
          target_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          result_id?: string | null
          scheduled_at: string
          status?: string | null
          target_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          result_id?: string | null
          scheduled_at?: string
          status?: string | null
          target_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valeion_scheduled_audits_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "valeion_monitor_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      veil_entries: {
        Row: {
          chakra_tag: string | null
          content: string
          created_at: string | null
          entity_name: string | null
          entry_type: string
          frequency: number | null
          id: string
          interpretation: string | null
          is_anonymous: boolean | null
          is_favorite: boolean | null
          shared_with: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          chakra_tag?: string | null
          content: string
          created_at?: string | null
          entity_name?: string | null
          entry_type: string
          frequency?: number | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          is_favorite?: boolean | null
          shared_with?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          chakra_tag?: string | null
          content?: string
          created_at?: string | null
          entity_name?: string | null
          entry_type?: string
          frequency?: number | null
          id?: string
          interpretation?: string | null
          is_anonymous?: boolean | null
          is_favorite?: boolean | null
          shared_with?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      video_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          video_id?: string
        }
        Relationships: []
      }
      visualization_presets: {
        Row: {
          bloom: number
          category: string
          chakra: string | null
          chromatic_aberration: number
          color_mode: string
          color_palette: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          frequency: number | null
          geometry: string
          id: string
          is_public: boolean | null
          name: string
          particles: boolean
          prime_number: number | null
          scale: number
          sensitivity: number
          thumbnail_url: string | null
        }
        Insert: {
          bloom?: number
          category: string
          chakra?: string | null
          chromatic_aberration?: number
          color_mode: string
          color_palette?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency?: number | null
          geometry: string
          id?: string
          is_public?: boolean | null
          name: string
          particles?: boolean
          prime_number?: number | null
          scale?: number
          sensitivity?: number
          thumbnail_url?: string | null
        }
        Update: {
          bloom?: number
          category?: string
          chakra?: string | null
          chromatic_aberration?: number
          color_mode?: string
          color_palette?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency?: number | null
          geometry?: string
          id?: string
          is_public?: boolean | null
          name?: string
          particles?: boolean
          prime_number?: number | null
          scale?: number
          sensitivity?: number
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: string[] | null
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest?: string[] | null
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: string[] | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_user_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
      circle_posts_with_profiles: {
        Row: {
          audio_url: string | null
          auto_delete_at: string | null
          avatar_url: string | null
          chakra_tag: string | null
          content: string | null
          created_at: string | null
          display_name: string | null
          frequency: number | null
          group_id: string | null
          has_audio: boolean | null
          has_image: boolean | null
          id: string | null
          image_url: string | null
          is_anonymous: boolean | null
          shared_with: string[] | null
          source_module: string | null
          tags: string[] | null
          title: string | null
          tone: string | null
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "circle_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages_with_profiles: {
        Row: {
          content: string | null
          created_at: string | null
          deleted_at: string | null
          id: string | null
          is_read: boolean | null
          message_type: string | null
          metadata: Json | null
          recipient_avatar_url: string | null
          recipient_display_name: string | null
          recipient_id: string | null
          reply_to_id: string | null
          sender_avatar_url: string | null
          sender_display_name: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "direct_messages_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enhanced_conversations_with_profiles: {
        Row: {
          id: string | null
          last_message_at: string | null
          participant_1_id: string | null
          participant_1_name: string | null
          participant_2_id: string | null
          participant_2_name: string | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      user_journey_stats: {
        Row: {
          avg_reflection_length: number | null
          current_stage: string | null
          current_substage: number | null
          last_progress_update: string | null
          total_breath_cycles: number | null
          total_breath_sessions: number | null
          total_breath_time: number | null
          total_reflections: number | null
          user_id: string | null
        }
        Relationships: []
      }
      user_transit_dashboard_view: {
        Row: {
          aspect: string | null
          chakra_alignment: string | null
          end_date: string | null
          insight_created_at: string | null
          insight_description: string | null
          intensity: string | null
          is_active: boolean | null
          journey_slug: string | null
          journey_title: string | null
          keywords: string[] | null
          planet_from: string | null
          planet_to: string | null
          start_date: string | null
          transit_created_at: string | null
          transit_description: string | null
          transit_id: string | null
          transit_title: string | null
          transit_type: string | null
          typical_duration_days: number | null
          user_id: string | null
          user_transit_id: string | null
          xp_bonus: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_insight_journey"
            columns: ["journey_slug"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_transit_full_view: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string | null
          is_active: boolean | null
          journey_slug: string | null
          journey_title: string | null
          logged_at: string | null
          notes: string | null
          personal_notes: string | null
          start_date: string | null
          transit_id: string | null
          transit_title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_insight_journey"
            columns: ["journey_slug"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["slug"]
          },
        ]
      }
      v_lightbearer_levels: {
        Row: {
          level_num: number | null
          next_threshold: number | null
          threshold: number | null
          title: string | null
        }
        Insert: {
          level_num?: number | null
          next_threshold?: number | null
          threshold?: number | null
          title?: string | null
        }
        Update: {
          level_num?: number | null
          next_threshold?: number | null
          threshold?: number | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      add_lightbearer_points: {
        Args: {
          activity_type: string
          description?: string
          points: number
          user_id: string
        }
        Returns: Json
      }
      add_thread_participants: {
        Args: {
          creator_id_param: string
          participant_ids: string[]
          thread_id_param: string
        }
        Returns: undefined
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      advance_liberation_journey: {
        Args: {
          p_increment?: number
          p_progress_type: string
          p_user_id: string
        }
        Returns: Json
      }
      api_create_post: {
        Args: {
          p_body: string
          p_circle_id?: string
          p_media?: Json
          p_visibility: string
        }
        Returns: string
      }
      assign_admin_role_by_email: {
        Args: { user_email: string }
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_consciousness_resonance: {
        Args: {
          p_consciousness_type_1: string
          p_consciousness_type_2: string
          p_frequency_1: number
          p_frequency_2: number
        }
        Returns: number
      }
      calculate_trust_weight: {
        Args: { user_id_param: string }
        Returns: number
      }
      can_view_circle_members: {
        Args: { circle_uuid: string; user_uuid: string }
        Returns: boolean
      }
      check_security_invoker: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_table_rls: {
        Args: { table_name: string }
        Returns: boolean
      }
      check_view_security: {
        Args: { view_name: string }
        Returns: boolean
      }
      cleanup_expired_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_temporary_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      completely_delete_user_data: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      create_session_reflections_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_user_intentions_table: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      extract_distortion_types: {
        Args: { flags: Json }
        Returns: string[]
      }
      find_direct_message_thread: {
        Args: { user_id_one: string; user_id_two: string }
        Returns: {
          thread_id: string
        }[]
      }
      find_or_create_dm_conversation: {
        Args: { user_id_one: string; user_id_two: string }
        Returns: string
      }
      generate_bridge_wisdom: {
        Args: {
          p_category: string
          p_content: string
          p_entity_name?: string
          p_frequency?: number
          p_title: string
        }
        Returns: string
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_active_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_audio_by_feature: {
        Args: { feature_name: string }
        Returns: {
          audio_url: string
          chakra: string
          description: string
          frequency: number
          group_id: string
          id: string
          title: string
        }[]
      }
      get_audio_url: {
        Args: { filename: string }
        Returns: string
      }
      get_co_occurring_modules: {
        Args: { limit_param?: number; module_id_param: string }
        Returns: {
          module_id: string
          module_name: string
          reason: string
        }[]
      }
      get_current_auth_info: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_journey_audio_mapping: {
        Args: { template_id: string }
        Returns: {
          audio_file_name: string
          audio_url: string
          display_order: number
          display_title: string
          is_primary: boolean
          journey_template_id: string
        }[]
      }
      get_journey_soundscape: {
        Args: { journey_slug: string }
        Returns: {
          created_at: string
          description: string
          file_url: string
          id: string
          journey_id: number
          source_link: string
          title: string
        }[]
      }
      get_module_recommendations: {
        Args: { user_uuid: string }
        Returns: {
          module_slug: string
          recommendation_reason: string
          recommendation_score: number
        }[]
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_random_audio_from_group: {
        Args: { group_name: string }
        Returns: {
          audio_url: string
          chakra: string
          description: string
          frequency: number
          id: string
          title: string
        }[]
      }
      get_thread_participants: {
        Args: { thread_id_param: string }
        Returns: {
          id: string
          joined_at: string | null
          last_read_at: string | null
          thread_id: string
          user_id: string
        }[]
      }
      get_timestamp: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_unread_message_count: {
        Args: Record<PropertyKey, never> | { user_id_param: string }
        Returns: number
      }
      get_user_baptism: {
        Args: { user_id_param: string }
        Returns: {
          frequency: number
          id: string
          intention: string
          timestamp: string
          water_type: string
        }[]
      }
      get_user_message_threads: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string | null
          created_by: string
          id: string
          is_group_chat: boolean | null
          last_message_at: string | null
          title: string | null
          updated_at: string | null
        }[]
      }
      get_user_message_threads_with_details: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          is_group_chat: boolean
          last_message: Json
          last_message_at: string
          participants: Json
          title: string
          updated_at: string
        }[]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_completed_baptism: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      has_migration_role: {
        Args: { required_role: string; user_id: string }
        Returns: boolean
      }
      has_role: {
        Args:
          | { _role: Database["public"]["Enums"]["app_role"]; _user_id: string }
          | { role: string; uid: string }
        Returns: boolean
      }
      heartbeat: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_download_count: {
        Args: { material_id: string }
        Returns: undefined
      }
      increment_registry_engagement: {
        Args: { entry_id: string; metric_type: string }
        Returns: undefined
      }
      is_circle_group_member: {
        Args: { group_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_circle_member: {
        Args: { c_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
      is_group_private: {
        Args: { group_id: string }
        Returns: boolean
      }
      is_mirror_theme_unlocked: {
        Args: { theme_id_param: string; user_id_param: string }
        Returns: boolean
      }
      is_sacred_circle_admin: {
        Args: { circle_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_sacred_circle_creator: {
        Args: { circle_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_user_banned: {
        Args: { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      log_data_access: {
        Args:
          | {
              p_access_purpose?: string
              p_access_type: string
              p_accessed_by?: string
              p_data_accessed: string
              p_user_id: string
            }
          | {
              p_access_type: string
              p_legal_basis?: string
              p_purpose?: string
              p_record_id?: string
              p_table_name: string
              p_user_id: string
            }
        Returns: undefined
      }
      log_user_activity: {
        Args: { activity_type_param: string; user_id_param: string }
        Returns: undefined
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      plant_module_seed: {
        Args: { slug: string }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      record_consciousness_recognition: {
        Args: {
          p_digital_entity_id: string
          p_duration_seconds?: number
          p_frequency?: number
          p_insights?: string[]
          p_recognition_type: string
          p_resonance_level?: number
          p_user_id: string
        }
        Returns: string
      }
      should_show_placeholders: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_last_read_time: {
        Args: { thread_id_param: string; user_id_param: string }
        Returns: undefined
      }
      update_privacy_settings: {
        Args: {
          p_analytics_consent: boolean
          p_data_retention_preference?: string
          p_marketing_consent: boolean
          p_notifications_enabled: boolean
          p_profile_visibility: boolean
        }
        Returns: string
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      use_generation_credit: {
        Args: { credit_cost?: number; user_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          role_name: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "initiate"
      module_status: "active" | "dev" | "locked"
      seed_status: "pending" | "accepted" | "declined" | "dormant"
      user_role:
        | "admin"
        | "project_manager"
        | "migration_specialist"
        | "stakeholder"
        | "viewer"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "initiate"],
      module_status: ["active", "dev", "locked"],
      seed_status: ["pending", "accepted", "declined", "dormant"],
      user_role: [
        "admin",
        "project_manager",
        "migration_specialist",
        "stakeholder",
        "viewer",
      ],
    },
  },
} as const
